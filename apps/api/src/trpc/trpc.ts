import { initTRPC, TRPCError } from "@trpc/server"
import type { Context } from "./context.js"
import superjson from "superjson"

const t = initTRPC.context<Context>().create()

const requireAuth = t.middleware(({ ctx, next }) => {
    if (!ctx.userId) throw new TRPCError({ code: "UNAUTHORIZED" })
    return next({
        ctx: {
            ...ctx,
            userId: ctx.userId,
        },
    })
})

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(requireAuth)
