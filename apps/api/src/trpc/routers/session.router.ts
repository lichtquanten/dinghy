import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { prisma } from "@/infrastructure/db.js"
import {
    createWherebyMeeting,
    isExpiringSoon,
    refreshWherebyMeeting,
} from "@/services/session.js"
import { protectedProcedure, router } from "@/trpc/trpc.js"

export const sessionRouter = router({
    enter: protectedProcedure
        .input(z.object({ pairingId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const pairing = await prisma.pairing.findUnique({
                where: { id: input.pairingId },
                include: {
                    session: {
                        include: { wherebyMeeting: true },
                    },
                },
            })

            if (!pairing) {
                throw new TRPCError({ code: "NOT_FOUND" })
            }

            if (!pairing.memberIds.includes(ctx.userId)) {
                throw new TRPCError({ code: "FORBIDDEN" })
            }

            if (!pairing.session) {
                const wherebyMeeting = await createWherebyMeeting()
                const [session] = await Promise.all([
                    prisma.session.create({
                        data: {
                            pairingId: input.pairingId,
                            wherebyMeetingId: wherebyMeeting.id,
                        },
                    }),
                    prisma.pairing.update({
                        where: { id: input.pairingId },
                        data: { isStarted: true },
                    }),
                ])

                return {
                    sessionId: session.id,
                    wherebyMeetingUrl: wherebyMeeting.url,
                }
            }

            const { session } = pairing
            const wherebyMeeting = isExpiringSoon(
                session.wherebyMeeting.expiresAt
            )
                ? await refreshWherebyMeeting(
                      session.wherebyMeeting.id,
                      session.id
                  )
                : session.wherebyMeeting

            return {
                sessionId: session.id,
                wherebyMeetingUrl: wherebyMeeting.url,
            }
        }),
})
