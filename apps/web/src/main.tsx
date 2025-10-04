import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ClerkProvider } from "@clerk/clerk-react"
import { HashRouter } from "react-router-dom"
import { env } from "./config/env.js"
import "./index.css"
import "../../../packages/ui/src/styles/globals.css"
import { App } from "./App.tsx"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ClerkProvider publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}>
            <HashRouter>
                <App />
            </HashRouter>
        </ClerkProvider>
    </StrictMode>
)
