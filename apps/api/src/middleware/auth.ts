import { getAuth } from "@hono/clerk-auth"
import { createMiddleware } from "hono/factory"
import { HTTPException } from "hono/http-exception"
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
        throw new HTTPException(401, { message: "Unauthorized" })
    }

    let clerkUser
    try {
        clerkUser = await clerkClient.users.getUser(auth.userId)
    } catch {
        throw new HTTPException(503, { message: "Unable to verify user" })
    }

    const email = clerkUser.primaryEmailAddress?.emailAddress

    if (!email) {
        throw new HTTPException(500, {
            message: `No primary email address associated with Clerk user ID: ${auth.userId}`,
        })
    }

    const firstName = clerkUser.firstName ?? "Unknown"
    const lastName = clerkUser.lastName ?? ""

    const user = await prisma.user.upsert({
        where: {
            clerkId: auth.userId,
        },
        update: {
            email,
            firstName,
            lastName,
        },
        create: {
            clerkId: auth.userId,
            email,
            firstName,
            lastName,
        },
    })

    c.set("auth", auth)
    c.set("userId", user.id)
    c.set("user", user)

    await next()
})
