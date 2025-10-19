import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { streamText, convertToModelMessages } from "ai"
import { ChatRequestSchema } from "./types.js"
import { getModel } from "./models.js"

export const maxDuration = 30

export const aiRoutes = new Hono()

aiRoutes.post("/chat", zValidator("json", ChatRequestSchema), (c) => {
    const { messages, model: modelId } = c.req.valid("json")
    const model = getModel(modelId)!

    const result = streamText({
        model,
        messages: convertToModelMessages(messages),
        system: "You are a helpful assistant that can answer questions and help with tasks",
    })

    return result.toUIMessageStreamResponse()
})
