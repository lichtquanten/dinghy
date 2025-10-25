import { getConnInfo } from "@hono/node-server/conninfo"
import { rateLimiter, type Store } from "hono-rate-limiter"
import { RedisStore } from "rate-limit-redis"
import { redisClient } from "@/infrastructure/redis.js"
import type { AuthVariables } from "./auth.js"

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
    }) as unknown as Store<{ Variables: AuthVariables }>,
})

export const rateLimitJudge0 = rateLimiter<{ Variables: AuthVariables }>({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: "draft-6",
    keyGenerator: (c) => "judge-" + c.var.userId,
    store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }) as unknown as Store<{ Variables: AuthVariables }>,
})
