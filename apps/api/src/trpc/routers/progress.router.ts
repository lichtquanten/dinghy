import { z } from "zod"
import { ProgressModel } from "@/infrastructure/mongodb.js"
import { idSchema } from "@/lib/validators.js"
import { protectedProcedure, router } from "@/trpc/trpc.js"

export const progressRouter = router({
    get: protectedProcedure.input(z.object({ assignmentId: idSchema })).query(
        async ({ ctx, input }) =>
            await ProgressModel.findOne({
                userId: ctx.userId,
                assignmentId: input.assignmentId,
            }).lean()
    ),

    save: protectedProcedure
        .input(
            z.object({
                assignmentId: idSchema,
                code: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await ProgressModel.updateOne(
                {
                    userId: ctx.userId,
                    assignmentId: input.assignmentId,
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
