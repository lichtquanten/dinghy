import { createClient } from "@redis/client"
import { env } from "@/config/env.js"

export const redisClient = createClient({
    url: env.REDIS_URL,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 20) return new Error("Too many retries")
            return Math.min(retries * 50, 3000)
        },
        keepAlive: true,
        connectTimeout: 10000,
    },
})

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
