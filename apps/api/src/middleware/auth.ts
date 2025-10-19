import { getAuth } from "@hono/clerk-auth"
import { createMiddleware } from "hono/factory"

export type AuthVariables = {
    auth: ReturnType<typeof getAuth>
    userId: string
}

export const requireAuth = createMiddleware<{
    Variables: AuthVariables
}>(async (c, next) => {
    const auth = getAuth(c)
    if (!auth?.userId) {
        return c.json({ message: "Unauthorized" }, 401)
    }
    c.set("auth", auth)
    c.set("userId", auth.userId)
    await next()
})
