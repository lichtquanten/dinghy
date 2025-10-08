import type { LanguageModel } from "ai"
import { modelCatalog, type ModelId } from "@workspace/ai-models/catalog.ts"
import { openai } from "@ai-sdk/openai"
import { deepseek } from "@ai-sdk/deepseek"
import { createOllama } from "ollama-ai-provider-v2"
import { env } from "../../config/env.ts"

const ollama = createOllama({ baseURL: env.OLLAMA_API_URL })

const modelsById = {
    "gpt-4o": openai("gpt-4o"),
    "deepseek-chat": deepseek("deepseek-chat"),
    "ben1t0/tiny-llm": ollama("ben1t0/tiny-llm"),
} as const satisfies Record<ModelId, LanguageModel>

export function getModel(id: ModelId): LanguageModel {
    return modelsById[id]
}

export function isValidModelId(id: string): id is ModelId {
    return id in modelsById
}

export function getValidModelIds(): ModelId[] {
    return modelCatalog.map((m) => m.id)
}
