import { TRPCError } from "@trpc/server"
import z from "zod"
import { prisma } from "@/infrastructure/db.js"
import { protectedProcedure, router } from "@/trpc/trpc.js"

export const courseRouter = router({
    get: protectedProcedure.query(async ({ ctx }) => {
        const enrollments = await prisma.enrollment.findMany({
            where: {
                userId: ctx.userId,
            },
            include: {
                course: true,
            },
        })

        return enrollments.map((enrollment) => {
            const { joinCode: _, ...rest } = enrollment.course
            return rest
        })
    }),
    join: protectedProcedure
        .input(
            z.object({
                joinCode: z.string().min(1, "Join code cannot be empty").trim(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await prisma.$transaction(async (tx) => {
                const course = await tx.course.findUnique({
                    where: {
                        joinCode: input.joinCode,
                    },
                    select: { id: true, title: true },
                })
                if (!course) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message:
                            "Invalid course code. Please check and try again.",
                    })
                }
                const existingEnrollment = await tx.enrollment.findUnique({
                    where: {
                        userId_courseId: {
                            userId: ctx.userId,
                            courseId: course.id,
                        },
                    },
                })
                if (existingEnrollment) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "You're already enrolled in this course.",
                    })
                }
                await tx.enrollment.create({
                    data: {
                        userId: ctx.userId,
                        courseId: course.id,
                    },
                })
                return { courseTitle: course.title } as const
            })
        }),
})

export type CourseRouter = typeof courseRouter
