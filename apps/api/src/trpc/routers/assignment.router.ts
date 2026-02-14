import { TRPCError } from "@trpc/server"
import { z } from "zod"
import type { Prisma } from "@workspace/db/client"
import { prisma } from "@/infrastructure/db.js"
import { idInput } from "@/lib/validators.js"
import {
    requireAssignmentAccess,
    requireCourseMembership,
} from "@/trpc/lib/permissions.js"
import { protectedProcedure, router } from "@/trpc/trpc.js"

type PairingWithPartners = Prisma.PairingGetPayload<{
    include: { partners: true }
}>

function formatPairing(pairings: PairingWithPartners[], userId: string) {
    if (pairings.length > 1) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "User has multiple pairings for assignment",
        })
    }

    const pairing = pairings[0]
    if (!pairing) return null

    const partners = pairing.partners.filter((m) => m.id !== userId)
    if (partners.length !== 1 || !partners[0]) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Pairing must have exactly one partner",
        })
    }

    const partner = partners[0]

    return {
        id: pairing.id,
        isCompleted: pairing.isCompleted,
        startedAt: pairing.startedAt,
        partner: {
            id: partner.id,
            firstName: partner.firstName,
            lastInitial: partner.lastName[0],
        },
    }
}

export const assignmentRouter = router({
    get: protectedProcedure.input(idInput).query(async ({ ctx, input }) => {
        return prisma.$transaction(async (tx) => {
            await requireAssignmentAccess(tx, ctx.userId, input.id)

            const assignment = await tx.assignment.findUnique({
                where: { id: input.id },
                include: {
                    tasks: {
                        orderBy: { order: "asc" },
                        include: {
                            testCases: true,
                            phases: {
                                orderBy: { order: "asc" },
                            },
                        },
                    },
                    pairings: {
                        where: { partnerIds: { has: ctx.userId } },
                        include: { partners: true },
                    },
                },
            })

            if (!assignment) {
                throw new TRPCError({ code: "NOT_FOUND" })
            }

            const { pairings, ...rest } = assignment

            return {
                ...rest,
                pairing: formatPairing(pairings, ctx.userId),
            }
        })
    }),

    getByCourse: protectedProcedure
        .input(z.object({ courseId: z.string() }))
        .query(async ({ ctx, input }) => {
            return prisma.$transaction(async (tx) => {
                await requireCourseMembership(tx, ctx.userId, input.courseId)

                const assignments = await tx.assignment.findMany({
                    where: { courseId: input.courseId },
                    include: {
                        tasks: {
                            orderBy: { order: "asc" },
                            include: {
                                testCases: true,
                                phases: {
                                    orderBy: { order: "asc" },
                                },
                            },
                        },
                        pairings: {
                            where: { partnerIds: { has: ctx.userId } },
                            include: { partners: true },
                        },
                    },
                })

                return assignments.map(({ pairings, ...rest }) => ({
                    ...rest,
                    pairing: formatPairing(pairings, ctx.userId),
                }))
            })
        }),
})

export type AssignmentRouter = typeof assignmentRouter
