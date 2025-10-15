import { rateLimiter, type Store } from "hono-rate-limiter"
import { RedisStore } from "rate-limit-redis"
import { getConnInfo } from "@hono/node-server/conninfo"
import { redisClient } from "#infrastructure/redis.ts"

export const rateLimit = rateLimiter({
    windowMs: 60 * 1000,
    limit: 100,
    standardHeaders: "draft-6",
    keyGenerator: (c) => {
        const info = getConnInfo(c)
        if (!info.remote.address) {
            throw new Error("Cannot determine remote address")
        }
        return info.remote.address
    },
    store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }) as unknown as Store,
})

export const rateLimitJudge0 = rateLimiter({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: "draft-6",
    keyGenerator: (c) => "judge-" + c.var.userId!,
    store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }) as unknown as Store,
})
