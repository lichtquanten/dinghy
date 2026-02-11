import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"
import { z } from "zod"
import { assignmentRouter } from "./routers/assignment.router.js"
import { courseRouter } from "./routers/course.router.js"
import { executionRouter } from "./routers/execution.router.js"
import { pairingRouter } from "./routers/pairing.router.js"
import { sessionRouter } from "./routers/session.router.js"
import { timeRouter } from "./routers/time.router.js"
import { userRouter } from "./routers/user.router.js"
import { protectedProcedure, publicProcedure, router } from "./trpc.js"

export const appRouter = router({
    assignment: assignmentRouter,
    course: courseRouter,
    execution: executionRouter,
    pairing: pairingRouter,
    session: sessionRouter,
    time: timeRouter,
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

    secret: protectedProcedure.input(z.string().min(1)).query(({ input }) => {
        return `${input.split("").reverse().join("")}`
    }),
})

export type AppRouter = typeof appRouter
export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
