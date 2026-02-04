import { redisClient } from "@/infrastructure/redis.js"

export async function publish(channel: string, data: unknown): Promise<void> {
    await redisClient.publish(channel, JSON.stringify(data))
}

export async function waitForMessage<T>(
    channel: string,
    signal?: AbortSignal,
    timeoutMs = 30_000
): Promise<T> {
    if (signal?.aborted) {
        return Promise.reject(new Error("Aborted"))
    }

    const subscriber = redisClient.duplicate()
    await subscriber.connect()

    return new Promise<T>((resolve, reject) => {
        let settled = false

        const cleanup = () => {
            if (settled) return
            settled = true
            clearTimeout(timeout)
            signal?.removeEventListener("abort", onAbort)
            subscriber.unsubscribe(channel).catch(() => {})
            subscriber.quit().catch(() => {})
        }

        const onAbort = () => {
            cleanup()
            reject(new Error("Aborted"))
        }

        const timeout = setTimeout(() => {
            cleanup()
            reject(new Error("Timeout waiting for message"))
        }, timeoutMs)

        signal?.addEventListener("abort", onAbort, { once: true })

        subscriber
            .subscribe(channel, (message) => {
                cleanup()
                resolve(JSON.parse(message) as T)
            })
            .catch((err: unknown) => {
                cleanup()
                reject(err instanceof Error ? err : new Error(String(err)))
            })
    })
}
