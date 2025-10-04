import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

const host = process.env.API_HOST ?? "http://localhost"
const port = process.env.API_PORT ?? "3000"
const target = `${host}:${port}`

export default defineConfig({
    plugins: [tailwindcss(), react(), tsconfigPaths()],
    server: {
        host: true,
        proxy: {
            "/api": {
                target,
                changeOrigin: true,
            },
        },
    },
})
