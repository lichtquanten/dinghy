import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { PairingRoomId } from "@workspace/pairing"
import { prisma } from "@/infrastructure/db.js"
import { withLock } from "@/infrastructure/redis.js"
import {
    advancePhase,
    ensurePairingInitialized,
    withPairingStore,
} from "@/services/pairing.js"
import { destroySession } from "@/services/session.js"
import { protectedProcedure, router } from "@/trpc/trpc.js"

async function findPairingForUser(pairingId: string, userId: string) {
    const pairing = await prisma.pairing.findUnique({
        where: { id: pairingId },
        include: {
            partners: true,
            session: true,
            assignment: {
                include: {
                    tasks: {
                        include: { phases: true },
                        orderBy: { order: "asc" },
                    },
                },
            },
        },
    })

    if (!pairing) {
        throw new TRPCError({ code: "NOT_FOUND" })
    }

    if (!pairing.partnerIds.includes(userId)) {
        throw new TRPCError({ code: "FORBIDDEN" })
    }

    return pairing
}

function getPartner(
    pairing: Awaited<ReturnType<typeof findPairingForUser>>,
    userId: string
) {
    const partner = pairing.partners.find((p) => p.id !== userId)

    if (!partner) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Pairing has no partner",
        })
    }

    return {
        firstName: partner.firstName,
        lastInitial: partner.lastName[0],
    }
}

async function completePairing(pairingId: string, sessionId?: string) {
    await prisma.pairing.update({
        where: { id: pairingId },
        data: { isCompleted: true },
    })

    if (sessionId) {
        setTimeout(() => void destroySession(sessionId), 5000)
    }
}

export const pairingRouter = router({
    init: protectedProcedure
        .input(z.object({ pairingId: z.string() }))
        .query(async ({ ctx, input }) => {
            const pairing = await findPairingForUser(
                input.pairingId,
                ctx.userId
            )

            if (pairing.partnerIds.length !== 2) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Pairing requires exactly 2 partners",
                })
            }

            await ensurePairingInitialized(pairing.id)
            return {}
        }),

    get: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const pairing = await findPairingForUser(input.id, ctx.userId)

            return {
                pairingId: pairing.id,
                assignmentId: pairing.assignmentId,
                partner: getPartner(pairing, ctx.userId),
                isCompleted: pairing.isCompleted,
                startedAt: pairing.startedAt,
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
                include: { partners: true },
            })

            if (!pairing) return null

            const partner = pairing.partners.find((p) => p.id !== ctx.userId)

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
                isCompleted: pairing.isCompleted,
                startedAt: pairing.startedAt,
            }
        }),

    startPairing: protectedProcedure
        .input(z.object({ pairingId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const pairing = await findPairingForUser(
                input.pairingId,
                ctx.userId
            )
            if (pairing.isCompleted) return

            await withLock(`pairing:${input.pairingId}:start`, async () => {
                const tasks = pairing.assignment.tasks
                const roomId = PairingRoomId.from(input.pairingId)

                await withPairingStore(roomId, (store, state) => {
                    if (state.isStarted) return false

                    const phase =
                        tasks[state.taskIndex]?.phases[state.phaseIndex]
                    if (!phase) {
                        throw new TRPCError({
                            code: "INTERNAL_SERVER_ERROR",
                            message: `Invalid phase: task ${state.taskIndex}, phase ${state.phaseIndex}`,
                        })
                    }

                    store.startPhase(phase.maxTimeSecs ?? 0, Date.now())
                })

                if (!pairing.startedAt) {
                    await prisma.pairing.update({
                        where: { id: pairing.id },
                        data: {
                            startedAt: new Date(),
                        },
                    })
                }
            })
        }),

    resumePhase: protectedProcedure
        .input(z.object({ pairingId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const pairing = await findPairingForUser(
                input.pairingId,
                ctx.userId
            )
            if (pairing.isCompleted) return

            await withLock(`pairing:${input.pairingId}:resume`, async () => {
                const roomId = PairingRoomId.from(input.pairingId)

                await withPairingStore(roomId, (store, state) => {
                    if (!state.isPaused) return false
                    store.resumePhase(Date.now())
                })
            })
        }),

    advancePhase: protectedProcedure
        .input(
            z.object({
                pairingId: z.string(),
                taskIndex: z.number(),
                phaseIndex: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const pairing = await findPairingForUser(
                input.pairingId,
                ctx.userId
            )
            if (pairing.isCompleted) return

            let didComplete = false

            await withLock(`pairing:${input.pairingId}:advance`, async () => {
                const roomId = PairingRoomId.from(input.pairingId)
                didComplete = await advancePhase(
                    roomId,
                    pairing.partnerIds,
                    pairing.assignment.tasks,
                    input.taskIndex,
                    input.phaseIndex
                )
            })

            if (didComplete) {
                await completePairing(pairing.id, pairing.session?.id)
            }
        }),
})
