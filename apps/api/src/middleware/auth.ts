import { getAuth } from "@hono/clerk-auth"
import { createMiddleware } from "hono/factory"
import type { User } from "@workspace/database"
import { UserModel } from "@/infrastructure/mongodb.js"

export type AuthVariables = {
    auth: ReturnType<typeof getAuth>
    userId: string
    user: User
}

export const requireAuth = createMiddleware<{
    Variables: AuthVariables
}>(async (c, next) => {
    const auth = getAuth(c)
    if (!auth?.userId) {
        return c.json({ message: "Unauthorized" }, 401)
    }
    const user = await UserModel.findById(auth.userId).lean()
    if (!user) {
        return c.json({ message: "User data not found" }, 500)
    }
    c.set("auth", auth)
    c.set("userId", auth.userId)
    c.set("user", user)
    await next()
})
