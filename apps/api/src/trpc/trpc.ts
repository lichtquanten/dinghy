import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"
import { clerkClient } from "@/infrastructure/auth.js"
import { prisma } from "@/infrastructure/db.js"
import { type Context } from "./context.js"

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
    const clerkUser = await clerkClient.users.getUser(ctx.userId)
    const email = clerkUser.primaryEmailAddress?.emailAddress
    if (!email)
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `No primary email address associated with Clerk user ID: ${ctx.userId}`,
        })
    const user = await prisma.user.upsert({
        where: {
            id: ctx.userId,
        },
        update: {},
        create: {
            id: ctx.userId,
            email,
        },
    })

    return next({
        ctx: {
            ...ctx,
            userId: ctx.userId, // Type narrowing
            user: user,
        },
    })
})

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(requireAuth)
