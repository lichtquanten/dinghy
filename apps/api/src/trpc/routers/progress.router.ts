import { z } from "zod"
import { ProgressModel } from "@/infrastructure/mongodb.js"
import { protectedProcedure, router } from "@/trpc/trpc.js"

export const progressRouter = router({
    get: protectedProcedure
        .input(z.object({ assignmentSlug: z.string() }))
        .query(
            async ({ ctx, input }) =>
                await ProgressModel.findOne({
                    userId: ctx.userId,
                    assignmentSlug: input.assignmentSlug,
                }).lean()
        ),

    save: protectedProcedure
        .input(
            z.object({
                assignmentSlug: z.string(),
                code: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await ProgressModel.updateOne(
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
                }
            ).lean()
        }),
})

export type ProgressRouter = typeof progressRouter
