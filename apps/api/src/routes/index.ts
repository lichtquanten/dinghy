import { Hono } from "hono"
import { getIsDbConnected } from "@/infrastructure/db.js"
import { getIsRedisConnected } from "@/infrastructure/redis.js"
import { routes as liveblocksRoutes } from "./liveblocks.js"
import { routes as webhookRoutes } from "./webhooks.js"

export const routes = new Hono()

routes.get("/healthz", (c) => c.json({ status: "ok" }))

routes.get("/readyz", (c) => {
    const checks = { redis: getIsRedisConnected(), db: getIsDbConnected() }
    const healthy = Object.values(checks).every(Boolean)
    return c.json(
        { status: healthy ? "ok" : "degraded", checks },
        healthy ? 200 : 503
    )
})

routes.route("/liveblocks", liveblocksRoutes)
routes.route("/webhooks", webhookRoutes)
