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

            const status = pairing.isCompleted
                ? ("completed" as const)
                : pairing.isStarted
                  ? ("in_progress" as const)
                  : ("not_started" as const)

            return {
                pairingId: pairing.id,
                assignmentId: pairing.assignmentId,
                partner: {
                    firstName: partner.firstName,
                    lastInitial: partner.lastName[0],
                },
                status,
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

            const status = pairing.isCompleted
                ? ("completed" as const)
                : pairing.isStarted
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
                include: { session: true },
            })

            if (!pairing) {
                throw new TRPCError({ code: "NOT_FOUND" })
            }

            if (!pairing.partnerIds.includes(ctx.userId)) {
                throw new TRPCError({ code: "FORBIDDEN" })
            }

            if (pairing.isCompleted) {
                return
            }

            if (pairing.session) {
                await destroySession(pairing.session.id)
            }
            await prisma.pairing.update({
                where: { id: input.pairingId },
                data: { isCompleted: true },
            })
        }),
    advanceTask: protectedProcedure
        .input(z.object({ pairingId: z.string(), fromTaskIndex: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const pairing = await prisma.pairing.findUnique({
                where: { id: input.pairingId },
                include: {
                    assignment: {
                        include: { tasks: true },
                    },
                },
            })

            if (!pairing) {
                throw new TRPCError({ code: "NOT_FOUND" })
            }

            if (!pairing.partnerIds.includes(ctx.userId)) {
                throw new TRPCError({ code: "FORBIDDEN" })
            }

            const taskCount = pairing.assignment.tasks.length

            if (input.fromTaskIndex >= taskCount - 1) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Already on last task",
                })
            }

            const result = await prisma.pairing.updateMany({
                where: {
                    id: input.pairingId,
                    currentTaskIndex: input.fromTaskIndex,
                },
                data: { currentTaskIndex: input.fromTaskIndex + 1 },
            })

            if (result.count === 0) {
                const current = await prisma.pairing.findUnique({
                    where: { id: input.pairingId },
                    select: { currentTaskIndex: true },
                })
                return { currentTaskIndex: current!.currentTaskIndex }
            }

            return { currentTaskIndex: input.fromTaskIndex + 1 }
        }),
})
