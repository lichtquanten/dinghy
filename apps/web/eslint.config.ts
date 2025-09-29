import { defineConfig } from "eslint/config"
import svelte from "eslint-plugin-svelte"
import ts from "typescript-eslint"
import rootConfig from "../../eslint.config.js"
// @ts-expect-error No typing
import svelteConfig from "./svelte.config.js"

export default defineConfig([
    {
        extends: [rootConfig, svelte.configs["flat/recommended"]],
    },
    {
        files: ["**/*.svelte"],
        languageOptions: {
            parserOptions: {
                svelteConfig, // eslint-disable-line @typescript-eslint/no-unsafe-assignment
                extraFileExtensions: [".svelte"],
                parser: ts.parser,
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
])
