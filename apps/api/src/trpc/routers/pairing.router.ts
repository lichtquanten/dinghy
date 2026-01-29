import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { prisma } from "@/infrastructure/db.js"
import { deleteMeeting } from "@/integrations/whereby/client.js"
import { protectedProcedure, router } from "@/trpc/trpc.js"

export const pairingRouter = router({
    getByAssignment: protectedProcedure
        .input(z.object({ assignmentId: z.string() }))
        .query(async ({ ctx, input }) => {
            const pairing = await prisma.pairing.findFirst({
                where: {
                    assignmentId: input.assignmentId,
                    memberIds: { has: ctx.userId },
                },
                include: { members: true, session: true },
            })

            if (!pairing) {
                return null
            }

            const partner = pairing.members.find((m) => m.id !== ctx.userId)
            if (!partner) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Pairing has no partner",
                })
            }

            const status = pairing.isCompleted
                ? ("completed" as const)
                : pairing.session
                  ? ("in_progress" as const)
                  : ("not_started" as const)

            return {
                pairingId: pairing.id,
                partner: {
                    firstName: partner.firstName,
                    lastInitial: partner.lastName[0],
                },
                status,
            }
        }),
    complete: protectedProcedure
        .input(z.object({ pairingId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const pairing = await prisma.pairing.findUnique({
                where: { id: input.pairingId },
                include: { session: { include: { wherebyMeeting: true } } },
            })

            if (!pairing) {
                throw new TRPCError({ code: "NOT_FOUND" })
            }

            if (!pairing.memberIds.includes(ctx.userId)) {
                throw new TRPCError({ code: "FORBIDDEN" })
            }

            if (pairing.isCompleted) {
                return
            }

            if (pairing.session?.wherebyMeeting) {
                await deleteMeeting(pairing.session.wherebyMeeting.id)
            }

            if (pairing.session) {
                await prisma.$transaction([
                    prisma.wherebyMeeting.delete({
                        where: { sessionId: pairing.session.id },
                    }),
                    prisma.session.delete({
                        where: { id: pairing.session.id },
                    }),
                    prisma.pairing.update({
                        where: { id: input.pairingId },
                        data: { isCompleted: true },
                    }),
                ])
            } else {
                await prisma.pairing.update({
                    where: { id: input.pairingId },
                    data: { isCompleted: true },
                })
            }
        }),
})
