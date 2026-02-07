import * as Y from "yjs"
import type { Assignment, Pairing } from "@workspace/db/client"
import { getPairingDoc, PairingRoomId } from "@workspace/pairing"
import { prisma } from "@/infrastructure/db.js"
import { redisClient } from "@/infrastructure/redis.js"
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

export async function ensurePairingInitialized(
    pairingId: Pairing["id"],
    partnerIds: Pairing["partnerIds"],
    starterCode: Assignment["starterCode"]
): Promise<void> {
    const lockKey = `lock:pairing:${pairingId}:init`
    const acquired = await redisClient.set(lockKey, "1", { EX: 300, NX: true })

    if (acquired) {
        try {
            await initializePairing(pairingId, partnerIds, starterCode)
        } finally {
            await redisClient.del(lockKey)
        }
    } else {
        await pollUntilInitialized(pairingId)
    }
}

async function initializePairing(
    pairingId: Pairing["id"],
    partnerIds: Pairing["partnerIds"],
    starterCode: Assignment["starterCode"]
): Promise<void> {
    const pairing = await prisma.pairing.findUnique({
        where: { id: pairingId },
        select: { isYjsInitialized: true },
    })

    if (pairing?.isYjsInitialized) {
        return
    }

    const ydoc = new Y.Doc()
    const pairingDoc = getPairingDoc(ydoc, partnerIds)

    pairingDoc.store.initialize(partnerIds)
    pairingDoc.sharedCode.ytext().insert(0, starterCode)
    for (const id of partnerIds) {
        if (!pairingDoc.userCode[id])
            throw new Error(`User code for user ${id} not found in pairing doc`)
        pairingDoc.userCode[id].ytext().insert(0, starterCode)
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

        const pairing = await prisma.pairing.findUnique({
            where: { id: pairingId },
            select: { isYjsInitialized: true },
        })

        if (pairing?.isYjsInitialized) return
    }

    throw new Error(`Pairing ${pairingId} initialization timed out`)
}
