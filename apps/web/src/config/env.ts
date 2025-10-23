import { z } from "zod"

const envSchema = z.object({
    VITE_CLERK_PUBLISHABLE_KEY: z.string(),
    VITE_MAX_EXECUTION_WAIT_TIME: z.coerce.number().positive().default(120),
    VITE_ENABLE_GPT5_NANO: z.coerce.boolean().default(false),
    VITE_ENABLE_DEEPSEEK: z.coerce.boolean().default(false),
    VITE_ENABLE_TINY_LLM: z.coerce.boolean().default(false),
    VITE_ENABLE_DEEPINFRA: z.coerce.boolean().default(false),
})

export const env = envSchema.parse({
    VITE_CLERK_PUBLISHABLE_KEY: import.meta.env
        .VITE_CLERK_PUBLISHABLE_KEY as string,
    VITE_MAX_EXECUTION_WAIT_TIME: import.meta.env
        .VITE_MAX_EXECUTION_WAIT_TIME as string,
    VITE_ENABLE_GPT5_NANO: import.meta.env.VITE_ENABLE_GPT5_NANO as string,
    VITE_ENABLE_DEEPSEEK: import.meta.env.VITE_ENABLE_DEEPSEEK as string,
    VITE_ENABLE_TINY_LLM: import.meta.env.VITE_ENABLE_TINY_LLM as string,
    VITE_ENABLE_DEEPINFRA: import.meta.env.VITE_ENABLE_DEEPINFRA as string,
})
