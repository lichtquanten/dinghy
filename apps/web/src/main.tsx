// main.tsx
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ClerkProvider } from "@clerk/clerk-react"
import { HashRouter } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./lib/query"
import { env } from "./config/env.ts"
import "./index.css"
import "@workspace/ui/globals.css"
import { App } from "./App"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ClerkProvider publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}>
            <HashRouter>
                <QueryClientProvider client={queryClient}>
                    <App />
                </QueryClientProvider>
            </HashRouter>
        </ClerkProvider>
    </StrictMode>
)
