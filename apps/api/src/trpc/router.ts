import { z } from "zod"
import { router, publicProcedure } from "./trpc.ts"
import { userRouter } from "./routers/user.router.ts"

export const appRouter = router({
    user: userRouter,

    health: publicProcedure.query(() => {
        return {
            status: "ok",
            timestamp: new Date(),
        }
    }),

    hello: publicProcedure.input(z.string().nullish()).query(({ input }) => {
        return `Hello there ${input ?? "World"}!`
    }),
})

export type AppRouter = typeof appRouter
