import { z } from "zod"
import { toPublicAssignment } from "@workspace/database/models/assignment.js"
import type {
    Assignment,
    AssignmentPublic,
} from "@workspace/database/types/assignment.js"
import { AssignmentModel } from "@/infrastructure/mongodb.js"
import { protectedProcedure, publicProcedure, router } from "@/trpc/trpc.js"

export const assignmentRouter = router({
    list: publicProcedure.query(async (): Promise<AssignmentPublic[]> => {
        const assignments = await AssignmentModel.find({
            status: "published",
        })
            .sort({ order: 1 })
            .lean()
            .exec()
        return assignments.map(toPublicAssignment)
    }),

    getBySlug: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ input }): Promise<AssignmentPublic> => {
            const assignment = await AssignmentModel.findOne({
                slug: input.slug,
            })
                .lean()
                .exec()

            if (!assignment) {
                throw new Error("Assignment not found")
            }

            return toPublicAssignment(assignment)
        }),

    listAll: protectedProcedure.query(async (): Promise<Assignment[]> => {
        return AssignmentModel.find().sort({ order: 1 }).lean().exec()
    }),
})
