import { defineConfig } from "tsdown"

export default defineConfig([
    // Browser build
    {
        entry: ["src/generated/prisma/browser.ts"],
        dts: true,
        hash: false,
        target: "es2023",
        platform: "browser",
        outDir: "dist/browser",
        ignoreWatch: ["dist/**", "node_modules/**"],
    },
    // Node build
    {
        entry: [
            "src/generated/prisma/client.ts",
            "src/generated/prisma/commonInputTypes.ts",
            "src/generated/prisma/enums.ts",
            "src/generated/prisma/models.ts",
        ],
        dts: true,
        hash: false,
        target: "node2023",
        platform: "node",
        outDir: "dist/node",
        ignoreWatch: ["dist/**", "node_modules/**"],
    },
])
