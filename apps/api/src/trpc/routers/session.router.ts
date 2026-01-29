// session.router.ts
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { prisma } from "@/infrastructure/db.js"
import { authorizeUser } from "@/integrations/liveblocks/client.js"
import { createMeeting as createWherebyMeeting } from "@/integrations/whereby/client.js"
import { protectedProcedure, router } from "@/trpc/trpc.js"

export const sessionRouter = router({
    enter: protectedProcedure
        .input(z.object({ pairingId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const pairing = await prisma.pairing.findUnique({
                where: { id: input.pairingId },
                include: {
                    members: true,
                    session: {
                        include: { wherebyMeeting: true },
                    },
                    assignment: {
                        include: {
                            tasks: {
                                orderBy: { order: "asc" },
                                include: { testCases: true },
                            },
                        },
                    },
                },
            })

            if (!pairing) {
                throw new TRPCError({ code: "NOT_FOUND" })
            }

            if (!pairing.memberIds.includes(ctx.userId)) {
                throw new TRPCError({ code: "FORBIDDEN" })
            }

            let session = pairing.session

            if (!session) {
                const wherebyMeeting = await createWherebyMeeting()

                session = await prisma.session.create({
                    data: {
                        pairingId: input.pairingId,
                        wherebyMeeting: {
                            create: {
                                id: wherebyMeeting.meetingId,
                                url: wherebyMeeting.roomUrl,
                                expiresAt: wherebyMeeting.endDate,
                            },
                        },
                    },
                    include: { wherebyMeeting: true },
                })
            }

            if (!session.wherebyMeeting) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Session missing whereby room",
                })
            }

            const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000)

            if (session.wherebyMeeting.expiresAt < twoHoursFromNow) {
                const wherebyMeeting = await createWherebyMeeting()

                session.wherebyMeeting = await prisma.wherebyMeeting.update({
                    where: { id: session.wherebyMeeting.id },
                    data: {
                        url: wherebyMeeting.roomUrl,
                        expiresAt: wherebyMeeting.endDate,
                    },
                })
            }

            const { token } = await authorizeUser(
                ctx.userId,
                `pairing:${pairing.id}`
            )

            const partner = pairing.members.find((m) => m.id !== ctx.userId)
            if (!partner) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Pairing has no partner",
                })
            }

            return {
                sessionId: session.id,
                currentTaskIndex: session.currentTaskIndex,
                wherebyMeetingUrl: session.wherebyMeeting.url,
                liveblocksToken: token,
                assignment: pairing.assignment,
                partner: {
                    id: partner.id,
                    firstName: partner.firstName,
                    lastInitial: partner.lastName[0],
                },
            }
        }),
    advanceTask: protectedProcedure
        .input(z.object({ sessionId: z.string(), fromTaskIndex: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const session = await prisma.session.findUnique({
                where: { id: input.sessionId },
                include: {
                    pairing: {
                        include: {
                            assignment: {
                                include: { tasks: true },
                            },
                        },
                    },
                },
            })

            if (!session) {
                throw new TRPCError({ code: "NOT_FOUND" })
            }

            if (!session.pairing.memberIds.includes(ctx.userId)) {
                throw new TRPCError({ code: "FORBIDDEN" })
            }

            const taskCount = session.pairing.assignment.tasks.length

            if (input.fromTaskIndex >= taskCount - 1) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Already on last task",
                })
            }

            const result = await prisma.session.updateMany({
                where: {
                    id: input.sessionId,
                    currentTaskIndex: input.fromTaskIndex,
                },
                data: { currentTaskIndex: input.fromTaskIndex + 1 },
            })

            if (result.count === 0) {
                const current = await prisma.session.findUnique({
                    where: { id: input.sessionId },
                    select: { currentTaskIndex: true },
                })
                return { currentTaskIndex: current!.currentTaskIndex }
            }

            return { currentTaskIndex: input.fromTaskIndex + 1 }
        }),
})
