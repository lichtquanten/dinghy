// App.tsx
import { Routes, Route, Navigate } from "react-router-dom"
import { Protect, useAuth } from "@clerk/clerk-react"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { LandingPage } from "./pages/LandingPage"
import { IdePage } from "./pages/IdePage"

function RootRedirect() {
    const { isSignedIn, isLoaded } = useAuth()

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        )
    }

    return isSignedIn ? <Navigate to="/ide" replace /> : <LandingPage />
}

export function App() {
    return (
        <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route
                path="/ide"
                element={
                    <Protect fallback={<Navigate to="/" replace />}>
                        <IdePage />
                    </Protect>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
