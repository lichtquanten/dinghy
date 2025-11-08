import { TRPCError } from "@trpc/server"
import mongoose from "mongoose"
import { z } from "zod"
import { SubmissionModel } from "@/infrastructure/mongodb.js"
import { idSchema } from "@/lib/validators.js"
import { protectedProcedure, router } from "@/trpc/trpc.js"

export const submissionRouter = router({
    get: protectedProcedure.input(z.object({ assignmentId: idSchema })).query(
        async ({ ctx, input }) =>
            await SubmissionModel.findOne({
                userId: ctx.userId,
                assignmentId: input.assignmentId,
            }).lean()
    ),

    hasSubmitted: protectedProcedure
        .input(
            z.object({
                assignmentId: idSchema,
            })
        )
        .query(async ({ ctx, input }) => {
            const result = await SubmissionModel.exists({
                userId: ctx.userId,
                assignmentId: input.assignmentId,
            })
            return result !== null
        }),
    submit: protectedProcedure
        .input(
            z.object({
                assignmentId: z.string(),
                code: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const result = await SubmissionModel.create({
                    userId: ctx.userId,
                    assignmentId: input.assignmentId,
                    code: input.code,
                })
                return result.toObject()
            } catch (error) {
                if (
                    error instanceof mongoose.mongo.MongoServerError &&
                    error.code === 11000
                ) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "You have already submitted this assignment",
                    })
                }
                throw error
            }
        }),
    unsubmit: protectedProcedure
        .input(
            z.object({
                assignmentId: idSchema,
            })
        )
        .mutation(async ({ ctx, input }) => {
            await SubmissionModel.deleteOne({
                userId: ctx.userId,
                assignmentId: input.assignmentId,
            })
        }),
})

export type SubmissionRouter = typeof submissionRouter
