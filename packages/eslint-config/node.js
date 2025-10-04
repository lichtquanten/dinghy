import globals from "globals"
import baseConfig from "./base.js"
import { defineConfig } from "eslint/config"

export default defineConfig([
    {
        extends: [baseConfig],
    },
    {
        files: ["**/*.{js,ts}"],
        languageOptions: {
            globals: { ...globals.node },
        },
    },
])
