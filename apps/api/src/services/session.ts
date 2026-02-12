import type { Pairing } from "@workspace/db/client"
import { prisma } from "@/infrastructure/db.js"
import { createMeeting, deleteMeeting } from "@/integrations/whereby/client.js"

export async function destroySession(sessionId: string) {
    const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: { wherebyMeeting: true },
    })
    if (!session) return

    await deleteMeeting(session.wherebyMeeting.wherebyId)

    await prisma.$transaction([
        prisma.wherebyMeeting.delete({
            where: { id: session.wherebyMeeting.id },
        }),
        prisma.session.delete({ where: { id: session.id } }),
    ])
}

export async function createWherebyMeeting() {
    const meeting = await createMeeting()
    return prisma.wherebyMeeting.create({
        data: {
            wherebyId: meeting.meetingId,
            url: meeting.roomUrl,
            expiresAt: meeting.endDate,
        },
    })
}

export async function refreshWherebyMeeting(
    wherebyMeetingId: string,
    sessionId: string
) {
    const old = await prisma.wherebyMeeting.findUniqueOrThrow({
        where: { id: wherebyMeetingId },
    })

    await deleteMeeting(old.wherebyId)

    const meeting = await createMeeting()
    const [_, newMeeting] = await Promise.all([
        prisma.wherebyMeeting.delete({ where: { id: wherebyMeetingId } }),
        prisma.wherebyMeeting.create({
            data: {
                wherebyId: meeting.meetingId,
                url: meeting.roomUrl,
                expiresAt: meeting.endDate,
                session: { connect: { id: sessionId } },
            },
        }),
    ])
    return newMeeting
}

export function isExpiringSoon(expiresAt: Date) {
    const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000)
    return expiresAt < twoHoursFromNow
}

export async function ensureSessionInitialized(
    pairingId: Pairing["id"]
): Promise<void> {
    const pairing = await prisma.pairing.findUniqueOrThrow({
        where: { id: pairingId },
        include: {
            session: {
                include: { wherebyMeeting: true },
            },
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

    await Promise.all([
        prisma.session.create({
            data: {
                pairingId,
                wherebyMeetingId: wherebyMeeting.id,
            },
        }),
        prisma.pairing.update({
            where: { id: pairingId },
            data: { status: "IN_PROGRESS" },
        }),
    ])
}
