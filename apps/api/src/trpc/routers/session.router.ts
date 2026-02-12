import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { prisma } from "@/infrastructure/db.js"
import { ensureSessionInitialized } from "@/services/session.js"
import { protectedProcedure, router } from "@/trpc/trpc.js"

export const sessionRouter = router({
    init: protectedProcedure
        .input(z.object({ pairingId: z.string() }))
        .query(async ({ ctx, input }) => {
            const pairing = await prisma.pairing.findUnique({
                where: { id: input.pairingId },
            })

            if (!pairing) {
                throw new TRPCError({ code: "NOT_FOUND" })
            }

            if (!pairing.partnerIds.includes(ctx.userId)) {
                throw new TRPCError({ code: "FORBIDDEN" })
            }

            await ensureSessionInitialized(input.pairingId)
        }),

    get: protectedProcedure
        .input(z.object({ pairingId: z.string() }))
        .query(async ({ ctx, input }) => {
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

            if (!pairing.partnerIds.includes(ctx.userId)) {
                throw new TRPCError({ code: "FORBIDDEN" })
            }

            if (!pairing.session) {
                return null
            }

            return {
                wherebyMeetingUrl: pairing.session.wherebyMeeting.url,
            }
        }),
})
