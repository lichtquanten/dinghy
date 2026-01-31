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
    if (!ctx.auth?.userId) throw new TRPCError({ code: "UNAUTHORIZED" })

    let clerkUser
    try {
        clerkUser = await clerkClient.users.getUser(ctx.auth.userId)
    } catch {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Unable to verify user",
        })
    }

    const email = clerkUser.primaryEmailAddress?.emailAddress

    if (!email) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `No primary email address associated with Clerk user ID: ${ctx.auth.userId}`,
        })
    }

    const firstName = clerkUser.firstName ?? "Unknown"
    const lastName = clerkUser.lastName ?? ""

    const user = await prisma.user.upsert({
        where: {
            clerkId: ctx.auth.userId,
        },
        update: {
            email,
            firstName,
            lastName,
        },
        create: {
            clerkId: ctx.auth.userId,
            email,
            firstName,
            lastName,
        },
    })

    return next({
        ctx: {
            ...ctx,
            userId: user.id,
            user: user,
        },
    })
})

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(requireAuth)
