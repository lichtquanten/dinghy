import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import runtimeEnv from "vite-plugin-runtime-env"

const headerKey = process.env.PROXY_HEADER_KEY
const headerValue = process.env.PROXY_HEADER_VALUE

export default defineConfig({
    plugins: [tailwindcss(), react(), tsconfigPaths(), runtimeEnv()],
    server: {
        host: true,
        proxy: {
            "/api": {
                target: process.env.API_URL,
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
