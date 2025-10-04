import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import { trpcServer } from "@hono/trpc-server"
import { Hono } from "hono"
import { appRouter } from "./trpc/router.ts"
import { createContext } from "./trpc/context.ts"
import { logger } from "hono/logger"
import { env } from "./config/env.ts"
import { rateLimit } from "./middleware/rate-limit.ts"
import { clerkMiddleware } from "@hono/clerk-auth"
import { judge0Routes } from "./integrations/judge0/routes.ts"
const app = new Hono()

app.use(logger())
app.use(rateLimit)
app.use(clerkMiddleware())

app.use(
    "/api/trpc/*",
    trpcServer({
        router: appRouter,
        createContext,
        endpoint: "/api/trpc",
    })
)

app.route("/api/judge0", judge0Routes)

app.get("/api/health", (c) => {
    return c.json({ status: "ok" })
})

app.use("/*", serveStatic({ root: "./public" }))

serve({
    fetch: app.fetch,
    port: env.API_PORT,
})
