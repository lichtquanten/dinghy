import { z } from "zod"
import { prisma } from "@/infrastructure/db.js"
import { requireAssignmentAccess } from "@/trpc/lib/require-enrollment.js"
import { protectedProcedure, router } from "@/trpc/trpc.js"

export const progressRouter = router({
    get: protectedProcedure.input(z.object({ assignmentId: z.string() })).query(
        async ({ ctx, input }) =>
            await prisma.progress.findUnique({
                where: {
                    userId_assignmentId: {
                        userId: ctx.userId,
                        assignmentId: input.assignmentId,
                    },
                },
            })
    ),

    save: protectedProcedure
        .input(
            z.object({
                assignmentId: z.string(),
                code: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await prisma.$transaction(async (tx) => {
                await requireAssignmentAccess(
                    tx,
                    ctx.userId,
                    input.assignmentId
                )
                await tx.progress.upsert({
                    where: {
                        userId_assignmentId: {
                            userId: ctx.userId,
                            assignmentId: input.assignmentId,
                        },
                    },
                    update: {
                        code: input.code,
                    },
                    create: {
                        userId: ctx.userId,
                        assignmentId: input.assignmentId,
                        code: input.code,
                    },
                })
            })
        }),
})

export type ProgressRouter = typeof progressRouter
