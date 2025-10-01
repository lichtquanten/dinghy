import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const host = process.env.API_HOST ?? "http://localhost"
const port = process.env.API_PORT ?? "3000"
const target = `${host}:${port}`

export default defineConfig({
    plugins: [tailwindcss(), react()],
    server: {
        host: true,
        proxy: {
            "/trpc": {
                target,
                changeOrigin: true,
            },
        },
    },
})
