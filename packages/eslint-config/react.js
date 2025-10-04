import { defineConfig, globalIgnores } from "eslint/config"
import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import baseConfig from "./base.js"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"

/**
 * A custom ESLint configuration for libraries that use React.
 */
export default defineConfig([
    globalIgnores(["dist"]),
    {
        extends: [baseConfig],
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
    {
        files: ["**/*.{tsx}"],
        plugins: {
            react,
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
])
