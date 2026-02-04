import { clerkMiddleware } from "@hono/clerk-auth"
import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import { trpcServer } from "@hono/trpc-server"
import { Hono } from "hono"
import { logger } from "hono/logger"
import { env } from "./config/env.js"
import { disconnect as disconnectDb } from "./infrastructure/db.js"
import { disconnect as disconnectRedis } from "./infrastructure/redis.js"
import { rateLimit } from "./middleware/rate-limit.js"
import { routes } from "./routes/index.js"
import { createContext } from "./trpc/context.js"
import { appRouter } from "./trpc/router.js"

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

app.route("/api", routes)

app.use("/*", serveStatic({ root: "./public" }))

serve(
    {
        fetch: app.fetch,
        port: env.API_CONTAINER_PORT,
    },
    (info) => {
        console.log(`API server is running on port ${info.port}.`)
    }
)

const gracefulShutdown = async (signal: string) => {
    console.log(`${signal} received, shutting down gracefully...`)
    await disconnectDb()
    disconnectRedis()
    process.exit(0)
}

process.on("SIGINT", () => void gracefulShutdown("SIGINT"))
process.on("SIGTERM", () => void gracefulShutdown("SIGTERM"))
