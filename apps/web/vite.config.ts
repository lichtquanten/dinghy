import { svelte } from "@sveltejs/vite-plugin-svelte"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
    plugins: [tailwindcss(), svelte()],
    server: {
        host: true,
        proxy: {
            "/trpc": {
                target: "http://localhost:3000",
                changeOrigin: true,
            },
        },
    },
})
