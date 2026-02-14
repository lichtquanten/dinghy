import * as Y from "yjs"
import type { Assignment, Pairing } from "@workspace/db/client"
import {
    createPairingStore,
    getPairingDoc,
    PairingRoomId,
} from "@workspace/pairing"
import type { PairingState, PairingStore } from "@workspace/pairing"
import { prisma } from "@/infrastructure/db.js"
import { withLock } from "@/infrastructure/redis.js"
import { liveblocks, sendYjsUpdate } from "@/integrations/liveblocks/client.js"

export async function createPairing(
    partnerIds: Pairing["partnerIds"],
    assignmentId: Assignment["id"]
) {
    const pairing = await prisma.pairing.create({
        data: {
            partnerIds,
            assignmentId,
        },
    })

    return pairing
}

export async function withPairingStore(
    roomId: string,
    fn: (store: PairingStore, state: PairingState) => void | false
): Promise<void> {
    const ydoc = new Y.Doc()
    const update = await liveblocks.getYjsDocumentAsBinaryUpdate(roomId)
    Y.applyUpdate(ydoc, new Uint8Array(update))

    const store = createPairingStore(ydoc)
    const state = store.get()

    const result = fn(store, state)

    if (result !== false) {
        await sendYjsUpdate(roomId, ydoc)
    }
}

export function computeSecsRemaining(state: PairingState): number {
    if (state.phaseSecsRemaining == null || state.phaseTickingSince == null) {
        return 0
    }
    const elapsed = (Date.now() - state.phaseTickingSince) / 1000
    return Math.max(0, state.phaseSecsRemaining - elapsed)
}

export async function ensurePairingInitialized(
    pairingId: Pairing["id"]
): Promise<void> {
    const acquired = await withLock(
        `pairing:${pairingId}:init`,
        async () => {
            await initializePairing(pairingId)
        },
        300
    )

    if (!acquired) {
        await pollUntilInitialized(pairingId)
    }
}

async function initializePairing(pairingId: Pairing["id"]): Promise<void> {
    const pairing = await prisma.pairing.findUniqueOrThrow({
        where: { id: pairingId },
        include: { assignment: { select: { starterCode: true } } },
    })

    if (pairing.isYjsInitialized) {
        return
    }

    const ydoc = new Y.Doc()
    const pairingDoc = getPairingDoc(ydoc, pairing.partnerIds)

    pairingDoc.store.initialize(pairing.partnerIds)

    pairingDoc.sharedCode.ytext().insert(0, pairing.assignment.starterCode)

    for (const id of pairing.partnerIds) {
        if (!pairingDoc.userCode[id])
            throw new Error(`User code for user ${id} not found in pairing doc`)

        pairingDoc.userCode[id]
            .ytext()
            .insert(0, pairing.assignment.starterCode)
    }

    const roomId = PairingRoomId.from(pairingId)

    await liveblocks.createRoom(roomId, {
        defaultAccesses: [],
        metadata: {
            pairingId,
        },
    })

    await sendYjsUpdate(roomId, ydoc)

    await prisma.pairing.update({
        where: { id: pairingId },
        data: { isYjsInitialized: true },
    })
}

async function pollUntilInitialized(
    pairingId: Pairing["id"],
    maxAttempts = 20,
    intervalMs = 250
): Promise<void> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs))

        const pairing = await prisma.pairing.findUniqueOrThrow({
            where: { id: pairingId },
            select: { isYjsInitialized: true },
        })

        if (pairing.isYjsInitialized) return
    }

    throw new Error(`Pairing ${pairingId} initialization timed out`)
}
