// app/main.tsx
import { ClerkProvider } from "@clerk/clerk-react"
import { QueryClientProvider } from "@tanstack/react-query"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { HashRouter } from "react-router-dom"
import { env } from "@/config/env.ts"
import { queryClient } from "@/lib/query.ts"
import "../index.css"
import "@workspace/ui/globals.css"
import { App } from "./App.tsx"

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
