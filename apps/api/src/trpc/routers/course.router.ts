import { TRPCError } from "@trpc/server"
import z from "zod"
import { prisma } from "@/infrastructure/db.js"
import { protectedProcedure, router } from "@/trpc/trpc.js"

export const courseRouter = router({
    get: protectedProcedure.query(async ({ ctx }) => {
        const memberships = await prisma.courseMembership.findMany({
            where: {
                userId: ctx.userId,
            },
            include: {
                course: true,
            },
        })

        return memberships.map((membership) => {
            const { joinCode: _, ...rest } = membership.course
            return { ...rest, role: membership.role }
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

                const existingMembership = await tx.courseMembership.findUnique(
                    {
                        where: {
                            userId_courseId: {
                                userId: ctx.userId,
                                courseId: course.id,
                            },
                        },
                    }
                )

                if (existingMembership) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "You're already a member of this course.",
                    })
                }

                await tx.courseMembership.create({
                    data: {
                        userId: ctx.userId,
                        courseId: course.id,
                        role: "student",
                    },
                })

                return { courseTitle: course.title } as const
            })
        }),
})

export type CourseRouter = typeof courseRouter
