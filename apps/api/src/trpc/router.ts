import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"
import { z } from "zod"
import { assignmentRouter } from "./routers/assignment.router.js"
import { courseRouter } from "./routers/course.router.js"
import { progressRouter } from "./routers/progress.router.js"
import { submissionRouter } from "./routers/submission.router.js"
import { protectedProcedure, publicProcedure, router } from "./trpc.js"

export const appRouter = router({
    assignment: assignmentRouter,
    course: courseRouter,
    progress: progressRouter,
    submission: submissionRouter,

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
