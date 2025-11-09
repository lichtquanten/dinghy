import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { toPublicAssignment } from "@workspace/database"
import { AssignmentModel, EnrollmentModel } from "@/infrastructure/mongodb.js"
import { idInput, idSchema } from "@/lib/validators.js"
import { protectedProcedure, router } from "@/trpc/trpc.js"

export const assignmentRouter = router({
    get: protectedProcedure.input(idInput).query(async ({ input }) => {
        const assignment = await AssignmentModel.findById(input.id).lean()

        if (!assignment) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Assignment not found",
            })
        }

        return toPublicAssignment(assignment)
    }),

    getByCourse: protectedProcedure
        .input(z.object({ courseId: idSchema }))
        .query(async ({ ctx, input }) => {
            if (
                !(await EnrollmentModel.exists({
                    courseId: input.courseId,
                    userId: ctx.user._id,
                }))
            ) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "User not enrolled in this course",
                })
            }
            const assignments = await AssignmentModel.find({
                courseId: input.courseId,
            })
            return assignments.map(toPublicAssignment)
        }),
})

export type AssignmentRouter = typeof assignmentRouter
