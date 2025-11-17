import { createHmac, randomBytes } from "crypto"
import path from "path"
import { env } from "@/config/env.js"
import { KEYS, redisClient } from "@/infrastructure/redis.js"
import { SubmissionMetadataSchema } from "./schema.js"

export function generateSubmissionId(): string {
    return randomBytes(16).toString("hex")
}

export async function generateCallbackUrl(
    submissionId: string,
    userId: string
): Promise<string> {
    const timestamp = Date.now()
    const signature = createHmac("sha256", env.CALLBACK_SECRET)
        .update(`${submissionId}:${userId}:${timestamp}`)
        .digest("hex")

    await redisClient.setEx(
        KEYS.judge0.submission(submissionId),
        3600,
        JSON.stringify({ userId, timestamp, signature, used: false })
    )
    const callbackUrl = new URL(env.API_CALLBACK_URL)
    callbackUrl.pathname = path.join(
        callbackUrl.pathname,
        "api",
        "judge0",
        "callback",
        submissionId
    )
    callbackUrl.searchParams.set("sig", signature)
    callbackUrl.searchParams.set("ts", timestamp.toString())
    return callbackUrl.toString()
}

export async function verifyAndConsumeCallback(
    submissionId: string,
    signature: string,
    timestamp: string
): Promise<string | null> {
    const key = KEYS.judge0.submission(submissionId)
    const data = await redisClient.get(key)

    if (!data) return null

    const pending = SubmissionMetadataSchema.parse(JSON.parse(data))

    if (pending.used) return null
    if (pending.timestamp.toString() !== timestamp) return null

    const expectedSig = createHmac("sha256", env.CALLBACK_SECRET)
        .update(`${submissionId}:${pending.userId}:${pending.timestamp}`)
        .digest("hex")

    if (signature !== expectedSig) return null

    const pipeline = redisClient.multi()
    pipeline.set(key, JSON.stringify({ ...pending, used: true }))
    pipeline.expire(key, 3600)
    await pipeline.exec()

    return pending.userId
}
