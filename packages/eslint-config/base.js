import js from "@eslint/js"
import { defineConfig, globalIgnores } from "eslint/config"
import importPlugin from "eslint-plugin-import"
import tseslint from "typescript-eslint"

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
    {
        files: ["**/*.{js,ts,tsx}"],
        plugins: {
            import: importPlugin,
        },
        rules: {
            "sort-imports": [
                "warn",
                {
                    ignoreCase: true,
                    ignoreDeclarationSort: true,
                    ignoreMemberSort: false,
                    allowSeparatedGroups: true,
                },
            ],
            "import/order": [
                "warn",
                {
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        "parent",
                        "sibling",
                        "index",
                    ],
                    pathGroups: [
                        {
                            pattern: "@workspace/**",
                            group: "external",
                            position: "after",
                        },
                        {
                            pattern: "@/**",
                            group: "internal",
                            position: "before",
                        },
                    ],
                    pathGroupsExcludedImportTypes: ["builtin"],
                    "newlines-between": "never",
                    alphabetize: {
                        order: "asc",
                        caseInsensitive: true,
                    },
                },
            ],
        },
    },
])
