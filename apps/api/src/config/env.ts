import { z } from "zod"

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),

    API_PORT: z.coerce.number().int().nonnegative().default(3000),

    LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),

    MONGO_URI: z.string(),

    CLERK_SECRET_KEY: z.string(),
    CLERK_PUBLISHABLE_KEY: z.string(),
})

export const env = envSchema.parse(process.env)
