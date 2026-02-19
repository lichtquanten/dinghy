import { getAuth } from "@hono/clerk-auth"
import { createMiddleware } from "hono/factory"
import { HTTPException } from "hono/http-exception"
import type { UserModel } from "@workspace/db/models"
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

    const email = auth.sessionClaims?.primaryEmailAddress
    const firstName = auth.sessionClaims?.firstName ?? "Unknown"
    const lastName = auth.sessionClaims?.lastName ?? ""

    if (!email) {
        throw new HTTPException(500, {
            message: `No primary email address associated with Clerk user ID: ${auth.userId}`,
        })
    }

    const user = await prisma.user.upsert({
        where: { clerkId: auth.userId },
        update: { email, firstName, lastName },
        create: { clerkId: auth.userId, email, firstName, lastName },
    })

    c.set("auth", auth)
    c.set("userId", user.id)
    c.set("user", user)
    await next()
})
