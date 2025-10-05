import { z } from "zod"

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),

    API_PORT: z.coerce.number().int().nonnegative().default(3000),

    LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),

    MONGO_API_URI: z.url(),

    REDIS_URL: z.url(),

    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_PUBLISHABLE_KEY: z.string().min(1),

    JUDGE0_URL: z.url(),
    JUDGE0_AUTHENTICATION_HEADER: z.string().min(1),
    JUDGE0_AUTHENTICATION_TOKEN: z.string().min(1),
    JUDGE0_RAPIDAPI_HOST: z.string().optional(),

    API_URL: z.url(),

    CALLBACK_SECRET: z
        .string()
        .length(64, {
            message:
                "CALLBACK_SECRET must be exactly 64 hexadecimal characters.",
        })
        .regex(/^[0-9a-fA-F]{64}$/, {
            message:
                "CALLBACK_SECRET must be composed of valid hex characters.",
        }),
})

export const env = envSchema.parse(process.env)
