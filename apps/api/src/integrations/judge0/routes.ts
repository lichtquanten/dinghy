import { Hono } from "hono"
import { proxy } from "hono/proxy"
import { streamSSE } from "hono/streaming"
import { env } from "@/config/env.js"
import { KEYS, redisClient } from "@/infrastructure/redis.js"
import { requireAuth } from "@/middleware/auth.js"
import { rateLimitJudge0 } from "@/middleware/rate-limit.js"
import {
    generateCallbackUrl,
    generateSubmissionId,
    verifyAndConsumeCallback,
} from "./security.js"

export const routes = new Hono()

routes.put("/callback/:submissionId", async (c) => {
    const submissionId = c.req.param("submissionId")
    const signature = c.req.query("sig")
    const timestamp = c.req.query("ts")

    if (!signature || !timestamp) {
        return c.json({ error: "Missing signature" }, 400)
    }

    const userId = await verifyAndConsumeCallback(
        submissionId,
        signature,
        timestamp
    )

    if (!userId) {
        return c.json({ error: "Invalid or already used signature" }, 403)
    }

    const result: unknown = await c.req.json()
    await redisClient.publish(
        KEYS.judge0.sseChannel(userId),
        JSON.stringify({ submissionId, result })
    )

    return c.json({ received: true })
})

routes.get("/stream", requireAuth, async (c) => {
    const userId = c.var.userId
    const subscriber = redisClient.duplicate()
    await subscriber.connect()

    return streamSSE(c, async (stream) => {
        const channel = KEYS.judge0.sseChannel(userId)

        await stream.writeSSE({
            data: "connected",
            event: "connected",
        })

        await subscriber.subscribe(channel, async (message) => {
            try {
                await stream.writeSSE({
                    data: message,
                })
            } catch (e) {
                console.error("Error writing SSE:", e)
            }
        })

        const heartbeatInterval = setInterval(() => {
            void stream
                .writeSSE({
                    data: "heartbeat",
                    event: "heartbeat",
                })
                .catch((e) => {
                    console.error("Heartbeat error:", e)
                    clearInterval(heartbeatInterval)
                })
        }, 30000)

        stream.onAbort(() => {
            clearInterval(heartbeatInterval)
            void subscriber.unsubscribe(channel).catch(console.error)
            void subscriber.quit().catch(console.error)
        })

        await new Promise(() => {})
    })
})

routes.post("/submissions", requireAuth, rateLimitJudge0, async (c) => {
    const body: Record<string, unknown> = await c.req.json()
    const submissionId = generateSubmissionId()
    body.callback_url = await generateCallbackUrl(submissionId, c.var.userId)

    const judge0Url = new URL(
        `submissions${new URL(c.req.url).search}`,
        env.JUDGE0_URL
    )

    console.log("sending")
    const response = await fetch(judge0Url, {
        method: "POST",
        headers: {
            [env.JUDGE0_AUTHENTICATION_HEADER]: env.JUDGE0_AUTHENTICATION_TOKEN,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
    console.log(response)

    const result = (await response.json()) as Record<string, unknown>
    console.log(result)
    return c.json({ ...result, submissionId })
})

routes.all("/*", requireAuth, rateLimitJudge0, (c) => {
    const headers: Record<string, string | undefined> = {
        [env.JUDGE0_AUTHENTICATION_HEADER]: env.JUDGE0_AUTHENTICATION_TOKEN,
        Authorization: undefined,
        Cookie: undefined,
    }

    // If using RapidAPI, add the host header
    if (env.JUDGE0_RAPIDAPI_HOST) {
        headers["x-rapidapi-host"] = env.JUDGE0_RAPIDAPI_HOST
    }
    return proxy(
        new URL(c.req.path.replace(/^\/judge0\/?/, ""), env.JUDGE0_URL),
        {
            ...c.req,
            headers,
        }
    )
})
