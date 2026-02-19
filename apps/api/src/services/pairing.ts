import * as Y from "yjs"
import {
    type Assignment,
    InteractionMode,
    type Pairing,
    type Phase,
    type Prisma,
} from "@workspace/db/client"
import {
    createPairingStore,
    getPairingDoc,
    PairingRoomId,
} from "@workspace/pairing"
import type { PairingDoc, PairingState, PairingStore } from "@workspace/pairing"
import { prisma } from "@/infrastructure/db.js"
import { withLock } from "@/infrastructure/redis.js"
import { liveblocks, sendYjsUpdate } from "@/integrations/liveblocks/client.js"

type TaskWithPhases = Prisma.TaskGetPayload<{
    include: { phases: true }
}>

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

export async function withPairingDoc(
    roomId: string,
    partnerIds: string[],
    fn: (doc: PairingDoc) => void | false
): Promise<void> {
    const ydoc = new Y.Doc()
    const update = await liveblocks.getYjsDocumentAsBinaryUpdate(roomId)
    Y.applyUpdate(ydoc, new Uint8Array(update))
    const doc = getPairingDoc(ydoc, partnerIds)
    const result = fn(doc)
    if (result !== false) {
        await sendYjsUpdate(roomId, ydoc)
    }
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

export async function advancePhase(
    roomId: string,
    partnerIds: string[],
    tasks: TaskWithPhases[],
    taskIndex: number,
    phaseIndex: number
): Promise<boolean> {
    let didComplete = false

    await withPairingDoc(roomId, partnerIds, (doc) => {
        const state = doc.store.get()

        if (state.taskIndex !== taskIndex) return false
        if (state.phaseIndex !== phaseIndex) return false

        const currentTask = tasks[state.taskIndex]
        if (!currentTask) {
            throw new Error(`Invalid task index: ${state.taskIndex}`)
        }
        const currentPhase = currentTask.phases[state.phaseIndex]
        if (!currentPhase) {
            throw new Error(`Invalid phase index: ${state.phaseIndex}`)
        }

        const isLastPhase = state.phaseIndex >= currentTask.phases.length - 1
        const isLastTask = state.taskIndex >= tasks.length - 1

        if (isLastPhase && isLastTask) {
            doc.store.complete()
            didComplete = true
            return
        }

        const nextPhase = resolveNextPhase(
            tasks,
            state.taskIndex,
            state.phaseIndex
        )

        if (isLastPhase) {
            doc.store.advanceTask()
        } else {
            doc.store.advancePhase(nextPhase.maxTimeSecs ?? 0, Date.now())
        }

        if (
            currentPhase.interactionMode === InteractionMode.collaborative &&
            nextPhase.interactionMode === InteractionMode.solo
        ) {
            const shared = doc.sharedCode.ytext().toJSON()
            for (const id of partnerIds) {
                const userYText = doc.userCode[id]?.ytext()
                if (!userYText) {
                    throw new Error(`No userCode ytext for partner ${id}`)
                }
                userYText.delete(0, userYText.length)
                userYText.insert(0, shared)
            }
        }
    })

    return didComplete
}

function resolveNextPhase(
    tasks: TaskWithPhases[],
    currentTaskIndex: number,
    currentPhaseIndex: number
): Phase {
    const currentTask = tasks[currentTaskIndex]
    if (!currentTask) {
        throw new Error(`Invalid task index: ${currentTaskIndex}`)
    }

    const isLastPhase = currentPhaseIndex >= currentTask.phases.length - 1

    if (isLastPhase) {
        const nextTask = tasks[currentTaskIndex + 1]
        if (!nextTask) {
            throw new Error(`No next task at index ${currentTaskIndex + 1}`)
        }
        const nextPhase = nextTask.phases[0]
        if (!nextPhase) {
            throw new Error(
                `Task at index ${currentTaskIndex + 1} has no phases`
            )
        }
        return nextPhase
    }

    const nextPhase = currentTask.phases[currentPhaseIndex + 1]
    if (!nextPhase) {
        throw new Error(`No phase at index ${currentPhaseIndex + 1}`)
    }
    return nextPhase
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
