import { defineConfig, globalIgnores } from "eslint/config"
import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import baseConfig from "./base.js"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"

export default defineConfig([
    globalIgnores(["dist"]),
    baseConfig,
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            globals: globals.browser,
            parserOptions: {
                tsconfigRootDir: import.meta.dirname,
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    react.configs.flat.recommended,
    react.configs.flat["jsx-runtime"],
    reactHooks.configs["recommended-latest"],
    reactRefresh.configs.vite,
])
