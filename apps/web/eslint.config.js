import config from "@workspace/eslint-config/react"
import { defineConfig } from "eslint/config"

/** @type {import("eslint").Linter.Config} */
export default defineConfig([
    ...config,
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
])
