import { z } from "zod"
import { validateUIMessages } from "ai"
import { type ModelId } from "@workspace/ai-models/catalog.ts"
import { getValidModelIds } from "./models.ts"

export const ChatRequestSchema = z.object({
    messages: z.any().transform(async (val) => {
        const result = await validateUIMessages({
            messages: val,
        })
        return result
    }),
    model: z.enum(getValidModelIds() as [ModelId, ...ModelId[]]),
})
