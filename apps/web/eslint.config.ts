// apps/web/eslint.config.ts
import { defineConfig } from "eslint/config"
import svelte from "eslint-plugin-svelte"
import tseslint from "typescript-eslint"
// @ts-ignore
import rootConfig from "../../eslint.config"
// @ts-ignore
import svelteConfig from "./svelte.config.js"

export default defineConfig([
    // Inherit all configurations from root
    ...rootConfig,

    // Add Svelte plugin's recommended flat config
    ...svelte.configs["flat/recommended"],

    // Configure parser options for Svelte files
    {
        files: ["**/*.svelte"],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
                extraFileExtensions: [".svelte"],
                svelteConfig,
            },
            tsconfigRootDir: import.meta.dirname,
        },
    },
])
