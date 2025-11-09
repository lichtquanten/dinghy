import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"
import { UserModel } from "@/infrastructure/mongodb.js"
import type { Context } from "./context.js"

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        console.error(error)
        return {
            ...shape,
            message:
                process.env.NODE_ENV === "production"
                    ? "An error occurred"
                    : error.message,
        }
    },
})

const requireAuth = t.middleware(async ({ ctx, next }) => {
    if (!ctx.userId) throw new TRPCError({ code: "UNAUTHORIZED" })
    const user = await UserModel.findById(ctx.userId).lean()
    if (!user)
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "User data not found",
        })

    return next({
        ctx: {
            ...ctx,
            userId: ctx.userId,
            user: user,
        },
    })
})

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(requireAuth)
