import { z } from "zod"
import { ProgressModel } from "@/infrastructure/mongodb.js"
import { protectedProcedure, router } from "@/trpc/trpc.js"

export const progressRouter = router({
    get: protectedProcedure
        .input(z.object({ assignmentSlug: z.string() }))
        .query(async ({ ctx, input }) => {
            const progress = await ProgressModel.findOne({
                userId: ctx.userId,
                assignmentSlug: input.assignmentSlug,
            })
                .lean()
                .exec()

            return progress
        }),

    save: protectedProcedure
        .input(
            z.object({
                assignmentSlug: z.string(),
                code: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const progress = await ProgressModel.findOneAndUpdate(
                {
                    userId: ctx.userId,
                    assignmentSlug: input.assignmentSlug,
                },
                {
                    $set: {
                        code: input.code,
                    },
                },
                {
                    upsert: true,
                    new: true,
                }
            )
                .lean()
                .exec()

            return progress
        }),
})

export type ProgressRouter = typeof progressRouter
