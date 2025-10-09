import { z } from "zod"

console.log(import.meta.env)

const envSchema = z.object({
    VITE_CLERK_PUBLISHABLE_KEY: z.string(),
    VITE_MAX_EXECUTION_WAIT_TIME: z.coerce.number().positive().default(120),
    VITE_ENABLE_GPT5_NANO: z.coerce.boolean().default(false),
    VITE_ENABLE_DEEPSEEK: z.coerce.boolean().default(false),
    VITE_ENABLE_TINY_LLM: z.coerce.boolean().default(false),
    VITE_ENABLE_DEEPINFRA: z.coerce.boolean().default(false),
})

export const env = envSchema.parse(import.meta.env)
