import { getAuth } from "@hono/clerk-auth"
import { TRPCError } from "@trpc/server"
import { createMiddleware } from "hono/factory"
import type { UserModel } from "@workspace/db/models"
import { clerkClient } from "@/infrastructure/auth.js"
import { prisma } from "@/infrastructure/db.js"

export type AuthVariables = {
    auth: ReturnType<typeof getAuth>
    userId: string
    user: UserModel
}

export const requireAuth = createMiddleware<{
    Variables: AuthVariables
}>(async (c, next) => {
    const auth = getAuth(c)
    if (!auth?.userId) {
        return c.json({ message: "Unauthorized" }, 401)
    }
    const clerkUser = await clerkClient.users.getUser(auth.userId)
    const email = clerkUser.primaryEmailAddress?.emailAddress
    if (!email)
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `No primary email address associated with Clerk user ID: ${auth.userId}`,
        })
    const user = await prisma.user.upsert({
        where: {
            id: auth.userId,
        },
        update: {},
        create: {
            id: auth.userId,
            email,
        },
    })
    c.set("auth", auth)
    c.set("userId", auth.userId)
    c.set("user", user)
    await next()
})
