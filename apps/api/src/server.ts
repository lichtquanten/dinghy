import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import { trpcServer } from "@hono/trpc-server"
import { Hono } from "hono"
import { appRouter } from "./trpc/router.js"
import { createContext } from "./trpc/context.js"
import { logger } from "hono/logger"
import { env } from "./config/env.js"
import { rateLimit } from "./middleware/rate-limit.js"
import { clerkMiddleware } from "@hono/clerk-auth"
import { judge0Routes } from "./integrations/judge0/routes.js"
import { aiRoutes } from "./integrations/ai/routes.js"
import { connectMongoDB, disconnectMongoDB } from "./infrastructure/mongodb.js"

const app = new Hono()

await connectMongoDB()

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

app.route("/api/ai", aiRoutes)

app.get("/api/health", (c) => {
    return c.json({ status: "ok" })
})

app.use("/*", serveStatic({ root: "./public" }))

serve(
    {
        fetch: app.fetch,
        port: env.API_PORT,
    },
    (info) => {
        console.log(`API server is running on port ${info.port}.`)
    }
)

const gracefulShutdown = async (signal: string) => {
    console.log(`${signal} received, shutting down gracefully...`)
    await disconnectMongoDB()
    process.exit(0)
}

process.on("SIGINT", () => void gracefulShutdown("SIGINT"))
process.on("SIGTERM", () => void gracefulShutdown("SIGTERM"))
