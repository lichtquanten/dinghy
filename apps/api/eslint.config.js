import { defineConfig } from "eslint/config"
import globals from "globals"
import config from "@workspace/eslint-config/node"

export default defineConfig([
    {
        extends: [config],
    },
    {
        files: ["**/*.{js,ts}"],
        languageOptions: {
            globals: { ...globals.node },
        },
    },
])
