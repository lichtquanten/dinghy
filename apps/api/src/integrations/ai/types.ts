import { validateUIMessages } from "ai"
import { z } from "zod"
import { modelCatalogToString, type ModelId } from "@workspace/ai-models"
import { isValidModelId } from "./models.js"

export const ChatRequestSchema = z.object({
    messages: z.any().transform(async (val) => {
        const result = await validateUIMessages({
            messages: val,
        })
        return result
    }),
    model: z.custom<ModelId>(
        (val) => typeof val === "string" && isValidModelId(val),
        {
            message: `Invalid model ID. Available models: ${modelCatalogToString()}`,
        }
    ),
})

export type ChatRequest = z.infer<typeof ChatRequestSchema>
