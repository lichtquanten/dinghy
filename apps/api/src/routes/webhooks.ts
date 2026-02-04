import { Hono } from "hono"
import { publish } from "@/lib/pubsub.js"
import { verifyWebhook } from "@/lib/webhooks.js"

export const routes = new Hono()

routes.put("/:id", async (c) => {
    const verified = await verifyWebhook({
        id: c.req.param("id"),
        signature: c.req.query("sig") ?? "",
        timestamp: c.req.query("t") ?? "",
    })

    if (!verified) {
        return c.json({ error: "Invalid webhook" }, 403)
    }

    const { channel } = verified.payload as { channel: string }
    const result: unknown = await c.req.json()
    await publish(channel, result)

    return c.json({ ok: true })
})
