import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { prisma } from "@/infrastructure/db.js"
import { destroySession } from "@/services/session.js"
import { protectedProcedure, router } from "@/trpc/trpc.js"

export const pairingRouter = router({
    get: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const pairing = await prisma.pairing.findUnique({
                where: { id: input.id },
                include: { partners: true, session: true },
            })

            if (!pairing) {
                throw new TRPCError({ code: "NOT_FOUND" })
            }

            if (!pairing.partnerIds.includes(ctx.userId)) {
                throw new TRPCError({ code: "FORBIDDEN" })
            }

            const partner = pairing.partners.find((m) => m.id !== ctx.userId)
            if (!partner) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Pairing has no partner",
                })
            }

            return {
                pairingId: pairing.id,
                assignmentId: pairing.assignmentId,
                partner: {
                    firstName: partner.firstName,
                    lastInitial: partner.lastName[0],
                },
                status: pairing.status,
            }
        }),
    getByAssignment: protectedProcedure
        .input(z.object({ assignmentId: z.string() }))
        .query(async ({ ctx, input }) => {
            const pairing = await prisma.pairing.findFirst({
                where: {
                    assignmentId: input.assignmentId,
                    partnerIds: { has: ctx.userId },
                },
                include: { partners: true, session: true },
            })

            if (!pairing) {
                return null
            }

            const partner = pairing.partners.find((m) => m.id !== ctx.userId)
            if (!partner) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Pairing has no partner",
                })
            }

            return {
                pairingId: pairing.id,
                partner: {
                    firstName: partner.firstName,
                    lastInitial: partner.lastName[0],
                },
                status: pairing.status,
            }
        }),
    complete: protectedProcedure
        .input(z.object({ pairingId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const pairing = await prisma.pairing.findUnique({
                where: { id: input.pairingId },
                include: { session: true },
            })

            if (!pairing) {
                throw new TRPCError({ code: "NOT_FOUND" })
            }

            if (!pairing.partnerIds.includes(ctx.userId)) {
                throw new TRPCError({ code: "FORBIDDEN" })
            }

            if (pairing.status === "COMPLETED") {
                return
            }

            if (pairing.session) {
                await destroySession(pairing.session.id)
            }
            await prisma.pairing.update({
                where: { id: input.pairingId },
                data: { status: "COMPLETED" },
            })
        }),
})
