import type { CodeLanguage } from "@workspace/db/client"
import { env } from "@/config/env.js"
import {
    type ExecutionResult,
    type Judge0Response,
    parseResponse,
    submit,
} from "@/integrations/judge0/client.js"
import { waitForMessage } from "@/lib/pubsub.js"
import { createWebhookUrl } from "@/lib/webhooks.js"

export type { ExecutionResult }

export interface RunOptions {
    code: string
    language: CodeLanguage
    stdin?: string
}

export async function run(
    options: RunOptions,
    signal?: AbortSignal
): Promise<ExecutionResult> {
    const channel = `execution:${crypto.randomUUID()}`

    const webhookUrl = await createWebhookUrl({
        baseUrl: env.API_CALLBACK_URL,
        path: "/api/webhooks",
        payload: { channel },
    })

    await submit({
        code: options.code,
        language: options.language,
        stdin: options.stdin,
        callbackUrl: webhookUrl,
    })

    const raw = await waitForMessage<Judge0Response>(channel, signal)
    return parseResponse(raw)
}
