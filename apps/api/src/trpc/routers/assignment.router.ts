import { z } from "zod"
import { toPublicAssignment } from "@workspace/database"
import { AssignmentModel } from "@/infrastructure/mongodb.js"
import { protectedProcedure, publicProcedure, router } from "@/trpc/trpc.js"

export const assignmentRouter = router({
    list: publicProcedure.query(async () => {
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
        .query(async ({ input }) => {
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

    listAll: protectedProcedure.query(async () => {
        return AssignmentModel.find().sort({ order: 1 }).lean().exec()
    }),
})

export type AssignmentRouter = typeof assignmentRouter
