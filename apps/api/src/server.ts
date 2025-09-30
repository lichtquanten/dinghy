import { clerkMiddleware } from "@hono/clerk-auth"
import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import { trpcServer } from "@hono/trpc-server"
import { Hono } from "hono"
import { appRouter } from "./trpc/router.ts"
import { createContext } from "./trpc/context.ts"
import { logger } from "hono/logger"
import { env } from "./config/env.ts"

const app = new Hono()

app.use("*", logger())
app.use("*", clerkMiddleware())

app.use(
    "/trpc/*",
    trpcServer({
        router: appRouter,
        createContext,
    })
)

app.get("/health", (c) => {
    return c.json({ status: "ok" })
})

app.use("/*", serveStatic({ root: "./public" }))

serve({
    fetch: app.fetch,
    port: env.API_PORT,
})
