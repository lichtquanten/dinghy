import { z } from "zod"
import { router, publicProcedure, protectedProcedure } from "../trpc.ts"

export const userRouter = router({
    getById: publicProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(({ input }) => {
            // Fetch user from database
            // const user = await db.user.findUnique({ where: { id: input.id } });

            return {
                id: input.id,
                name: `User ${input.id}`,
                bio: "Public bio information",
            }
        }),

    getMyProfile: protectedProcedure.query(({ ctx }) => {
        console.log("Fetching profile for user:", ctx.userId)

        // Fetch current user's full profile
        // const profile = await db.user.findUnique({
        //   where: { id: ctx.userId }
        // });

        return {
            id: ctx.userId,
            name: "Current User",
            email: "user@example.com",
            createdAt: new Date(),
        }
    }),

    updateProfile: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1).max(100),
                bio: z.string().max(500).optional(),
            })
        )
        .mutation(({ ctx, input }) => {
            console.log("Updating profile for user:", ctx.userId)

            // Update user in database
            // const updated = await db.user.update({
            //   where: { id: ctx.userId },
            //   data: input,
            // });

            return {
                success: true,
                id: ctx.userId,
                ...input,
            }
        }),

    search: publicProcedure
        .input(
            z.object({
                query: z.string().min(1),
                limit: z.number().min(1).max(100).default(10),
            })
        )
        .query(({ ctx, input }) => {
            const isLoggedIn = !!ctx.userId

            console.log("Searching users:", input.query)
            console.log("User logged in:", isLoggedIn)

            return {
                results: [
                    { id: "1", name: "Search Result 1" },
                    { id: "2", name: "Search Result 2" },
                ],
                personalized: isLoggedIn,
            }
        }),
})
