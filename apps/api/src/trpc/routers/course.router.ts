import { TRPCError } from "@trpc/server"
import { filterCourseForStudent } from "@workspace/database"
import { CourseModel, EnrollmentModel } from "@/infrastructure/mongodb.js"
import { protectedProcedure, router } from "@/trpc/trpc.js"

export const courseRouter = router({
    getMyCourses: protectedProcedure.query(async ({ ctx }) => {
        if (ctx.user.role !== "student") {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "This endpoint is only available to students",
            })
        }
        const courseIds = await EnrollmentModel.distinct("courseId", {
            userId: ctx.userId,
        })
        const courses = await CourseModel.find({
            _id: { $in: courseIds },
        }).lean()
        return courses.map(filterCourseForStudent)
    }),
})

export type CourseRouter = typeof courseRouter
