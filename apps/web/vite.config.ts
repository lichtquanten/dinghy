import { svelte } from "@sveltejs/vite-plugin-svelte"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

const host = process.env.API_HOST ?? "http://localhost"
const port = process.env.API_PORT ?? "3000"
const target = `${host}:${port}`

export default defineConfig({
    plugins: [tailwindcss(), svelte()],
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
