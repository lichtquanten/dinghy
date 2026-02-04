import { createHmac, randomBytes } from "crypto"
import { z } from "zod"
import { env } from "@/config/env.js"
import { redisClient } from "@/infrastructure/redis.js"

const WebhookMetadataSchema = z.object({
    signature: z.string(),
    createdAt: z.number(),
    expiresAt: z.number(),
    claimed: z.boolean(),
    payload: z.record(z.string(), z.unknown()),
})

const DEFAULT_TTL_SECONDS = 3600

function redisKey(id: string): string {
    return `webhook:${id}`
}

function sign(id: string, createdAt: number): string {
    return createHmac("sha256", env.WEBHOOK_SECRET)
        .update(`${id}:${createdAt}`)
        .digest("hex")
}

export interface CreateWebhookUrlOptions {
    baseUrl: string
    path: string
    payload: Record<string, unknown>
    ttlSeconds?: number
}

export async function createWebhookUrl(
    options: CreateWebhookUrlOptions
): Promise<string> {
    const { baseUrl, path, payload, ttlSeconds = DEFAULT_TTL_SECONDS } = options

    const id = randomBytes(16).toString("hex")
    const createdAt = Date.now()
    const expiresAt = createdAt + ttlSeconds * 1000
    const signature = sign(id, createdAt)

    await redisClient.setEx(
        redisKey(id),
        ttlSeconds,
        JSON.stringify({
            signature,
            createdAt,
            expiresAt,
            claimed: false,
            payload,
        })
    )

    const url = new URL(path, baseUrl)
    url.pathname = `${url.pathname}/${id}`.replace(/\/+/g, "/")
    url.searchParams.set("sig", signature)
    url.searchParams.set("t", createdAt.toString())

    return url.toString()
}

export interface VerifyWebhookParams {
    id: string
    signature: string
    timestamp: string
}

export async function verifyWebhook<T = Record<string, unknown>>(
    params: VerifyWebhookParams
): Promise<{ id: string; payload: T } | null> {
    const { id, signature, timestamp } = params
    const key = redisKey(id)

    const raw = await redisClient.get(key)
    if (!raw) return null

    const metadata = WebhookMetadataSchema.parse(JSON.parse(raw))

    if (metadata.claimed) return null
    if (metadata.createdAt.toString() !== timestamp) return null
    if (signature !== sign(id, metadata.createdAt)) return null
    if (Date.now() > metadata.expiresAt) return null

    await redisClient.setEx(
        key,
        Math.ceil((metadata.expiresAt - Date.now()) / 1000),
        JSON.stringify({ ...metadata, claimed: true })
    )

    return { id, payload: metadata.payload as T }
}
