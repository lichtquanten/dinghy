import { defineConfig } from "eslint/config"
import config from "@workspace/eslint-config/react"

/** @type {import("eslint").Linter.Config} */
export default defineConfig([
    {
        ignores: ["vite.config.ts"],
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
