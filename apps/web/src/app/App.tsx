// app/App.tsx
import { Protect, useAuth } from "@clerk/clerk-react"
import { Navigate, Route, Routes } from "react-router-dom"
import { Skeleton } from "@workspace/ui/components/skeleton.tsx"
import { Toaster } from "@workspace/ui/components/sonner.tsx"
import HubPage from "@/features/hub/Hub"
import JoinCourse from "@/features/JoinCourse"
import LandingPage from "@/features/Landing"
import StudioPage from "@/features/studio/Studio"

function AuthLoadingSkeleton() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="space-y-2">
                <Skeleton className="h-4 w-62.5" />
                <Skeleton className="h-4 w-50" />
            </div>
        </div>
    )
}

function RootRedirect() {
    const { isSignedIn, isLoaded } = useAuth()

    if (!isLoaded) return <AuthLoadingSkeleton />

    return isSignedIn ? <Navigate to="/hub" replace /> : <LandingPage />
}

export function App() {
    return (
        <>
            <Toaster richColors position="top-center" />
            <Routes>
                <Route path="/" element={<RootRedirect />} />
                <Route
                    path="/studio/:assignmentId"
                    element={
                        <Protect fallback={<Navigate to="/" replace />}>
                            <StudioPage />
                        </Protect>
                    }
                />
                <Route
                    path="/hub"
                    element={
                        <Protect fallback={<Navigate to="/" replace />}>
                            <HubPage />
                        </Protect>
                    }
                />
                <Route
                    path="/joinCourse"
                    element={
                        <Protect fallback={<Navigate to="/" replace />}>
                            <JoinCourse />
                        </Protect>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    )
}
