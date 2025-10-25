// app/App.tsx
import { Protect, useAuth } from "@clerk/clerk-react"
import { Navigate, Route, Routes } from "react-router-dom"
import { Skeleton } from "@workspace/ui/components/skeleton.tsx"
import LandingPage from "@/features/Landing"
import StudioPage from "@/features/studio/Studio"

function AuthLoadingSkeleton() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    )
}

function RootRedirect() {
    const { isSignedIn, isLoaded } = useAuth()

    if (!isLoaded) return <AuthLoadingSkeleton />

    return isSignedIn ? <Navigate to="/studio" replace /> : <LandingPage />
}

export function App() {
    return (
        <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route
                path="/studio"
                element={
                    <Protect fallback={<Navigate to="/" replace />}>
                        <StudioPage />
                    </Protect>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
