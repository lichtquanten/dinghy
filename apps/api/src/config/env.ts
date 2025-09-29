import { z } from "zod"

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: z.string().default("3000"),

    LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),

    MONGODB_URI: z.string(),
    DB_NAME: z.string().optional(),

    CLERK_SECRET_KEY: z.string(),
    CLERK_PUBLISHABLE_KEY: z.string(),
})

export const env = envSchema.parse(process.env)
