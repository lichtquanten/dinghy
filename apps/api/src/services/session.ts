import type { Pairing } from "@workspace/db/client"
import { prisma } from "@/infrastructure/db.js"
import { withLock } from "@/infrastructure/redis.js"
import { createMeeting, deleteMeeting } from "@/integrations/whereby/client.js"

export async function destroySession(sessionId: string) {
    const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: { wherebyMeeting: true },
    })

    if (!session) return

    await prisma.$transaction([
        prisma.session.delete({ where: { id: session.id } }),
        prisma.wherebyMeeting.delete({
            where: { id: session.wherebyMeeting.id },
        }),
    ])

    await deleteMeeting(session.wherebyMeeting.wherebyId)
}

async function createWherebyMeeting() {
    const meeting = await createMeeting()

    return prisma.wherebyMeeting.create({
        data: {
            wherebyId: meeting.meetingId,
            url: meeting.roomUrl,
            expiresAt: meeting.endDate,
        },
    })
}

async function refreshWherebyMeeting(
    wherebyMeetingId: string,
    sessionId: string
) {
    const old = await prisma.wherebyMeeting.findUniqueOrThrow({
        where: { id: wherebyMeetingId },
    })

    const meeting = await createMeeting()

    const newMeeting = await prisma.$transaction(async (tx) => {
        const created = await tx.wherebyMeeting.create({
            data: {
                wherebyId: meeting.meetingId,
                url: meeting.roomUrl,
                expiresAt: meeting.endDate,
            },
        })

        await tx.session.update({
            where: { id: sessionId },
            data: { wherebyMeetingId: created.id },
        })

        await tx.wherebyMeeting.delete({ where: { id: wherebyMeetingId } })

        return created
    })

    await deleteMeeting(old.wherebyId)

    return newMeeting
}

export function isExpiringSoon(expiresAt: Date) {
    const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000)
    return expiresAt < twoHoursFromNow
}

export async function ensureSessionInitialized(
    pairingId: Pairing["id"]
): Promise<void> {
    const acquired = await withLock(
        `pairing:${pairingId}:session`,
        async () => {
            await initializeSession(pairingId)
        },
        300
    )

    if (!acquired) {
        await pollUntilSessionInitialized(pairingId)
    }
}

async function initializeSession(pairingId: Pairing["id"]): Promise<void> {
    const pairing = await prisma.pairing.findUniqueOrThrow({
        where: { id: pairingId },
        include: {
            session: { include: { wherebyMeeting: true } },
        },
    })

    if (pairing.session) {
        if (isExpiringSoon(pairing.session.wherebyMeeting.expiresAt)) {
            await refreshWherebyMeeting(
                pairing.session.wherebyMeeting.id,
                pairing.session.id
            )
        }
        return
    }

    const wherebyMeeting = await createWherebyMeeting()

    await prisma.session.create({
        data: {
            pairingId,
            wherebyMeetingId: wherebyMeeting.id,
        },
    })
}

async function pollUntilSessionInitialized(
    pairingId: Pairing["id"],
    maxAttempts = 20,
    intervalMs = 250
): Promise<void> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs))

        const pairing = await prisma.pairing.findUniqueOrThrow({
            where: { id: pairingId },
            select: { session: { select: { id: true } } },
        })

        if (pairing.session) return
    }

    throw new Error(`Session initialization timed out for pairing ${pairingId}`)
}
