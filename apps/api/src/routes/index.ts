import { Hono } from "hono"
import { routes as liveblocksRoutes } from "./liveblocks.js"
import { routes as webhookRoutes } from "./webhooks.js"

export const routes = new Hono()

routes.get("/health", (c) => c.json({ status: "ok" }))
routes.route("/liveblocks", liveblocksRoutes)
routes.route("/webhooks", webhookRoutes)
