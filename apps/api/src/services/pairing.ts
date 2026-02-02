import { createPairingDoc, getRoomId } from "@workspace/collab"
import type { Assignment, Pairing } from "@workspace/db/client"
import { prisma } from "@/infrastructure/db.js"
import { redisClient } from "@/infrastructure/redis.js"
import { sendYjsUpdate } from "@/integrations/liveblocks/client.js"

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
        await initializePairing(pairingId, partnerIds, starterCode)
        await redisClient.del(lockKey)
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
        select: { yjsInitialized: true },
    })

    if (pairing?.yjsInitialized) return

    const doc = createPairingDoc(partnerIds, starterCode)
    const roomId = getRoomId(pairingId)
    await sendYjsUpdate(roomId, doc)

    await prisma.pairing.update({
        where: { id: pairingId },
        data: { yjsInitialized: true },
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
            select: { yjsInitialized: true },
        })

        if (pairing?.yjsInitialized) return
    }

    throw new Error(`Pairing ${pairingId} initialization timed out`)
}
