import { z } from "zod"

const envSchema = z.object({
    VITE_CLERK_PUBLISHABLE_KEY: z.string(),
    MAX_CODE_EXECUTION_WAIT: z.number().positive().default(10),
})

export const env = envSchema.parse(import.meta.env)
