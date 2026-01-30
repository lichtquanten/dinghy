// services/session.ts
import { prisma } from "@/infrastructure/db.js"
import { createMeeting, deleteMeeting } from "@/integrations/whereby/client.js"

export async function destroySession(sessionId: string) {
    const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: { wherebyMeeting: true },
    })

    if (!session) return

    await deleteMeeting(session.wherebyMeeting.id)
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
            id: meeting.meetingId,
            url: meeting.roomUrl,
            expiresAt: meeting.endDate,
        },
    })
}

export async function refreshWherebyMeeting(oldId: string, sessionId: string) {
    await deleteMeeting(oldId)
    const meeting = await createMeeting()

    const [_, newMeeting] = await Promise.all([
        prisma.wherebyMeeting.delete({ where: { id: oldId } }),
        prisma.wherebyMeeting.create({
            data: {
                id: meeting.meetingId,
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
