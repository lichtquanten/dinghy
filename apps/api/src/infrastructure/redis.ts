import { createClient } from "@redis/client"
import { env } from "@/config/env.js"

export const redisClient = createClient({ url: env.REDIS_URL })

redisClient.on("error", (err) => {
    console.error("Redis connection error:", err)
})

await redisClient.connect()

process.once("SIGTERM", () => {
    redisClient.destroy()
    process.exit(0)
})

export const KEYS = {
    judge0: {
        submission: (id: string) => `judge0:submission:${id}`,
        sseChannel: (userId: string) => `judge0:sse:${userId}`,
    },
}
