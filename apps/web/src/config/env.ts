import { z } from "zod"

console.log(import.meta.env)

const envSchema = z.object({
    VITE_CLERK_PUBLISHABLE_KEY: z.string(),
    MAX_EXECUTION_WAIT_TIME: z.number().positive().default(120),
})

export const env = envSchema.parse(import.meta.env)
