import config from "@workspace/eslint-config/base"
import { defineConfig } from "eslint/config"

/** @type {import("eslint").Linter.Config} */
export default defineConfig([
    {
        ignores: ["tsdown.config.ts", "prisma.config.ts"],
    },
    ...config,
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
])
