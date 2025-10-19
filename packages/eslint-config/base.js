import js from "@eslint/js"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([
    globalIgnores([
        "**/dist/**",
        "**/build/**",
        "**/.vite/**",
        "**/node_modules/**",
    ]),

    {
        files: ["**/*.{js,ts}"],
        extends: [js.configs.recommended],
    },

    {
        files: ["**/*.{ts,tsx}"],
        extends: [tseslint.configs.recommendedTypeChecked],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            "@typescript-eslint/consistent-type-imports": "warn",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/no-misused-promises": [
                "error",
                { checksVoidReturn: { attributes: false } },
            ],
        },
    },
])
