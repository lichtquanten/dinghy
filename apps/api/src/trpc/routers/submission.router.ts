import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { Prisma } from "@workspace/db/client"
import { prisma } from "@/infrastructure/db.js"
import { requireAssignmentAccess } from "@/trpc/lib/require-enrollment.js"
import { protectedProcedure, router } from "@/trpc/trpc.js"

export const submissionRouter = router({
    get: protectedProcedure.input(z.object({ assignmentId: z.string() })).query(
        async ({ ctx, input }) =>
            await prisma.submission.findUnique({
                where: {
                    userId_assignmentId: {
                        userId: ctx.userId,
                        assignmentId: input.assignmentId,
                    },
                },
            })
    ),

    hasSubmitted: protectedProcedure
        .input(
            z.object({
                assignmentId: z.string(),
            })
        )
        .query(
            async ({ ctx, input }) =>
                !!(await prisma.submission.findUnique({
                    where: {
                        userId_assignmentId: {
                            userId: ctx.userId,
                            assignmentId: input.assignmentId,
                        },
                    },
                    select: { id: true },
                }))
        ),
    submit: protectedProcedure
        .input(
            z.object({
                assignmentId: z.string(),
                code: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                return await prisma.$transaction(async (tx) => {
                    await requireAssignmentAccess(
                        tx,
                        ctx.userId,
                        input.assignmentId
                    )
                    return tx.submission.create({
                        data: {
                            userId: ctx.userId,
                            assignmentId: input.assignmentId,
                            code: input.code,
                        },
                    })
                })
            } catch (error) {
                if (
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === "P2002"
                ) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message:
                            "User has already submitted this assignment and is attempting resubmission.",
                    })
                }
                throw error
            }
        }),
    unsubmit: protectedProcedure
        .input(
            z.object({
                assignmentId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await prisma.submission.delete({
                where: {
                    userId_assignmentId: {
                        userId: ctx.userId,
                        assignmentId: input.assignmentId,
                    },
                },
            })
        }),
})

export type SubmissionRouter = typeof submissionRouter
