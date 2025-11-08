import { TRPCError } from "@trpc/server"
import { Types } from "mongoose"
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
        return assignments.map(toPublicAssignment)
    }),
    get: publicProcedure
        .input(
            z.object({
                id: z.string().refine((val) => Types.ObjectId.isValid(val), {
                    message: "Invalid ID format",
                }),
            })
        )
        .query(async ({ input }) => {
            const assignment = await AssignmentModel.findById(input.id).lean()

            if (!assignment) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Assignment not found",
                })
            }

            return toPublicAssignment(assignment)
        }),
    getBySlug: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ input }) => {
            const assignment = await AssignmentModel.findOne({
                slug: input.slug,
            }).lean()

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
