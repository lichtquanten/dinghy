import type { getAuth } from "@hono/clerk-auth"

declare module "hono" {
    interface ContextVariableMap {
        auth: ReturnType<typeof getAuth>
        userId: string | null
    }
}
