// apps/api/src/integrations/ai/models.ts
import type { LanguageModel } from "ai"
import { MODEL_DEFINITIONS, type ModelId } from "@workspace/ai-models"
import { openai } from "@ai-sdk/openai"
import { deepseek } from "@ai-sdk/deepseek"
import { createOllama } from "ollama-ai-provider-v2"
import { deepinfra } from "@ai-sdk/deepinfra"
import { env } from "../../config/env.ts"

const ollama = createOllama({ baseURL: env.OLLAMA_API_URL })

const modelsById: Partial<Record<ModelId, LanguageModel>> = {
    ...(env.ENABLE_GPT5_NANO && { "gpt-5-nano": openai("gpt-5-nano") }),
    ...(env.ENABLE_DEEPSEEK && { "deepseek-chat": deepseek("deepseek-chat") }),
    ...(env.ENABLE_TINY_LLM && {
        "ben1t0/tiny-llm": ollama("ben1t0/tiny-llm"),
    }),
    ...(env.ENABLE_DEEPINFRA && {
        "google/codegemma-7b-it": deepinfra("google/codegemma-7b-it"),
    }),
}

export function getModel(id: ModelId): LanguageModel | undefined {
    return modelsById[id]
}

export function isValidModelId(id: string): id is ModelId {
    return id in modelsById
}

export function getModelCatalog() {
    return MODEL_DEFINITIONS.filter((def) => def.id in modelsById).map(
        ({ id, label }) => ({ id, label })
    )
}
