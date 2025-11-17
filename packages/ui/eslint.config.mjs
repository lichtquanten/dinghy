import config from "@workspace/eslint-config/react"
import { defineConfig } from "eslint/config"

/** @type {import("eslint").Linter.Config} */
export default defineConfig([
    {
        ignores: ["tsdown.config.ts"],
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
