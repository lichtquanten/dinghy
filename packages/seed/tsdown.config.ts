import { defineConfig } from "tsdown"

export default defineConfig({
    entry: ["src/seed.ts"],
    dts: true,
    hash: false,
})
