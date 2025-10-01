import { defineConfig } from "eslint/config"
import rootConfig from "../../eslint.config.js"
import globals from "globals"

export default defineConfig([
    {
        extends: [rootConfig],
    },
    {
        files: ["**/*.{js,ts}"],
        languageOptions: {
            globals: { ...globals.node },
        },
    },
])
