import { z } from "zod"
import { router, publicProcedure, protectedProcedure } from "./trpc.js"
import { userRouter } from "./routers/user.router.js"
import { assignmentRouter } from "./routers/assignment.router.js"
import { progressRouter } from "./routers/progress.router.js"

export const appRouter = router({
    user: userRouter,
    assignment: assignmentRouter,
    progress: progressRouter,

    health: publicProcedure.query(() => {
        return {
            status: "ok",
            timestamp: new Date(),
        }
    }),

    hello: publicProcedure.input(z.string().nullish()).query(({ input }) => {
        return `Hello there ${input ?? "World"}!`
    }),

    secret: protectedProcedure.input(z.string().min(1)).query(({ input }) => {
        return `${input.split("").reverse().join("")}`
    }),
})
