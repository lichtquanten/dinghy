import js from "@eslint/js"
import rootConfig from "../../eslint.config.js"
import react from "eslint-plugin-react"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([
    globalIgnores(["dist"]),
    {
        extends: [rootConfig],
    },
    {
        files: ["**/*.{ts,tsx}"],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            react.configs.flat.recommended,
            react.configs.flat["jsx-runtime"],
            reactHooks.configs["recommended-latest"],
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ...react.configs.flat.recommended.languageOptions,
            globals: globals.browser,
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
])
