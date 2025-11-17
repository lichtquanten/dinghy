import { z } from "zod"
import { prisma } from "@/infrastructure/db.js"
import { idInput } from "@/lib/validators.js"
import {
    requireAssignmentAccess,
    requireCourseEnrollment,
} from "@/trpc/lib/require-enrollment.js"
import { protectedProcedure, router } from "@/trpc/trpc.js"

export const assignmentRouter = router({
    get: protectedProcedure.input(idInput).query(
        async ({ ctx, input }) =>
            await prisma.$transaction(async (tx) => {
                await requireAssignmentAccess(tx, ctx.userId, input.id)
                return await tx.assignment.findUnique({
                    where: {
                        id: input.id,
                    },
                    include: {
                        testCases: true,
                    },
                })
            })
    ),

    getByCourse: protectedProcedure
        .input(z.object({ courseId: z.string() }))
        .query(
            async ({ ctx, input }) =>
                await prisma.$transaction(async (tx) => {
                    await requireCourseEnrollment(
                        tx,
                        ctx.userId,
                        input.courseId
                    )
                    const assignments = await tx.assignment.findMany({
                        where: {
                            courseId: input.courseId,
                        },
                        select: {
                            id: true,
                            title: true,
                            dueDate: true,
                            submissions: {
                                where: { userId: ctx.userId },
                                select: { id: true },
                            },
                            progresses: {
                                where: { userId: ctx.userId },
                                select: { id: true },
                            },
                        },
                    })
                    return assignments.map((assignment) => {
                        const { submissions, progresses, ...rest } = assignment
                        return {
                            ...rest,
                            isSubmitted: !!submissions,
                            isStarted: !!progresses,
                        }
                    })
                })
        ),
})

export type AssignmentRouter = typeof assignmentRouter
