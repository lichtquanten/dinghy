import { createClient } from "@redis/client"
import { env } from "@/config/env.ts"

export const redisClient = createClient({ url: env.REDIS_URL })
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
