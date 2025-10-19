import { z } from "zod"
import { UserModel } from "@/infrastructure/mongodb.js"
import { publicProcedure, router } from "@/trpc/trpc.js"

export const userRouter = router({
    getByEmail: publicProcedure
        .input(z.object({ email: z.email() }))
        .query(async ({ input }) => {
            return UserModel.findOne({ email: input.email })
        }),

    create: publicProcedure
        .input(
            z.object({
                email: z.email(),
                name: z.string(),
                avatar_url: z.string().optional(),
            })
        )
        .mutation(async ({ input }) => {
            const user = await UserModel.create(input)
            return user.toObject()
        }),
})
