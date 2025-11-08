import { TRPCError } from "@trpc/server"
import { toPublicAssignment } from "@workspace/database"
import { AssignmentModel } from "@/infrastructure/mongodb.js"
import { idInput } from "@/lib/validators.js"
import { protectedProcedure, publicProcedure, router } from "@/trpc/trpc.js"

export const assignmentRouter = router({
    list: publicProcedure.query(async () => {
        const assignments = await AssignmentModel.find({
            status: "published",
        })
            .sort({ order: 1 })
            .lean()
        return assignments.map(toPublicAssignment)
    }),
    get: publicProcedure.input(idInput).query(async ({ input }) => {
        const assignment = await AssignmentModel.findById(input.id).lean()

        if (!assignment) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Assignment not found",
            })
        }

        return toPublicAssignment(assignment)
    }),

    listAll: protectedProcedure.query(async () => {
        return AssignmentModel.find().sort({ order: 1 }).lean()
    }),
})

export type AssignmentRouter = typeof assignmentRouter
