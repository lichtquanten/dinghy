import { z } from "zod"

const envSchema = z.object({
    VITE_CLERK_PUBLISHABLE_KEY: z.string(),
    VITE_MAX_EXECUTION_WAIT_TIME: z.coerce.number().positive().default(120),
})

export const env = envSchema.parse({
    VITE_CLERK_PUBLISHABLE_KEY: import.meta.env
        .VITE_CLERK_PUBLISHABLE_KEY as string,
    VITE_MAX_EXECUTION_WAIT_TIME: import.meta.env
        .VITE_MAX_EXECUTION_WAIT_TIME as string,
})
