import { createClient } from "@redis/client"
import { env } from "@/config/env.js"

export const redisClient = createClient({
    url: env.REDIS_URL,
    socket: {
        reconnectStrategy: (retries) => {
            console.warn(`Redis reconnect attempt ${retries}`)
            return Math.min(retries * 50, 3000)
        },
        keepAlive: true,
        connectTimeout: 10000,
    },
})

redisClient.on("error", (err) => {
    console.error("Redis error:", err)
})

await redisClient.connect()

export function disconnect() {
    redisClient.destroy()
}

export function getIsRedisConnected() {
    return redisClient.isReady
}

export const KEYS = {
    judge0: {
        submission: (id: string) => `judge0:submission:${id}`,
        sseChannel: (userId: string) => `judge0:sse:${userId}`,
    },
}

export async function withLock(
    key: string,
    fn: () => Promise<void>,
    ttlSeconds = 10
): Promise<boolean> {
    const lockKey = `lock:${key}`
    const acquired = await redisClient.set(lockKey, "1", {
        EX: ttlSeconds,
        NX: true,
    })

    if (!acquired) return false

    try {
        await fn()
    } finally {
        await redisClient.del(lockKey)
    }

    return true
}
