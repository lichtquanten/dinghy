export const MODEL_DEFINITIONS = [
    { id: "gpt-5-nano", label: "GPT 5 Nano" },
    { id: "deepseek-chat", label: "DeepSeek" },
    { id: "ben1t0/tiny-llm", label: "Tiny LLM" },
    { id: "google/codegemma-7b-it", label: "Gemma 7b IT" },
] as const

export type ModelDefinition = (typeof MODEL_DEFINITIONS)[number]
export type ModelId = ModelDefinition["id"]
export type Model = { id: ModelId; label: string }

export function findModel(id: string): ModelDefinition | undefined {
    return MODEL_DEFINITIONS.find((m) => m.id === id)
}

export function modelCatalogToString(): string {
    return MODEL_DEFINITIONS.map((m) => `${m.label} (${m.id})`).join("\n")
}
