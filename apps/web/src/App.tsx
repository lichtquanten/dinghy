// App.tsx
import { Routes, Route, Navigate } from "react-router-dom"
import { Protect, useAuth } from "@clerk/clerk-react"
import { Skeleton } from "@workspace/ui/components/skeleton.tsx"
import { LandingPage } from "./pages/LandingPage"
import { StudioPage } from "./pages/StudioPage"
import { trpc } from "@/lib/trpc"
import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"

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
    const {
        data: assignments,
        isLoading,
        error,
    } = useQuery(trpc.assignment.list.queryOptions())
    useEffect(() => {
        console.log("Assignments:", assignments)
    }, [assignments])
    useEffect(() => {
        console.log("Is Loading:", isLoading)
    }, [isLoading])
    useEffect(() => {
        console.log("Error:", error)
    }, [error])
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
