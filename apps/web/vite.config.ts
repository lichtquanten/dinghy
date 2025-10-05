import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

const apiUrl = process.env.API_URL

if (!apiUrl) {
    throw new Error(
        "Missing environment variable required for Vite config: API_URL"
    )
}

const headerKey = process.env.PROXY_HEADER_KEY
const headerValue = process.env.PROXY_HEADER_VALUE

export default defineConfig({
    plugins: [tailwindcss(), react(), tsconfigPaths()],
    server: {
        host: true,
        proxy: {
            "/api": {
                target: apiUrl,
                changeOrigin: true,
                configure: (proxy, _) => {
                    if (headerKey && headerValue)
                        proxy.on("proxyReq", (proxyReq, _) => {
                            proxyReq.setHeader(headerKey, headerValue)
                        })
                },
            },
        },
    },
})
