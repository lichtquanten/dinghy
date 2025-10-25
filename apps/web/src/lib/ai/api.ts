// apps/web/src/api/ai.ts
import type { ModelId } from "@workspace/ai-models"
import { type Model } from "@workspace/ai-models"
import { env } from "@/config/env.ts"

function createModel<T extends ModelId>(id: T, label: string): Model {
    return { id, label }
}

export const models: Model[] = [
    ...(env.VITE_ENABLE_GPT5_NANO
        ? [createModel("gpt-5-nano", "GPT-5-Nano")]
        : []),
    ...(env.VITE_ENABLE_DEEPSEEK
        ? [createModel("deepseek-chat", "Deepseek Chat")]
        : []),
    ...(env.VITE_ENABLE_TINY_LLM
        ? [createModel("ben1t0/tiny-llm", "Tiny LLM")]
        : []),
    ...(env.VITE_ENABLE_DEEPINFRA
        ? [createModel("google/codegemma-7b-it", "Gemma 7b it")]
        : []),
]
