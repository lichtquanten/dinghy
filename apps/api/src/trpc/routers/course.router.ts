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
})

export type CourseRouter = typeof courseRouter
