export const modelCatalog = [
    { id: "gpt-4o", label: "GPT 4o" },
    { id: "deepseek-chat", label: "DeepSeek" },
    { id: "ben1t0/tiny-llm", label: "Tiny LLM" },
] as const

export type ModelId = (typeof modelCatalog)[number]["id"]
export type Model = (typeof modelCatalog)[number]

export function listModels(): readonly Model[] {
    return modelCatalog
}

export function isValidModelId(id: string): id is ModelId {
    return modelCatalog.some((m) => m.id === id)
}
