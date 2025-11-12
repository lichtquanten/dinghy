import { defineConfig, env } from "prisma/config"

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
        seed: "",
    },
    engine: "classic",
    datasource: {
        url: process.env.PRISMA_DB_URL || "placeholder",
    },
})
