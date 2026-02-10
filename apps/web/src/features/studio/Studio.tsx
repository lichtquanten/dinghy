import { Suspense, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Navigate, useParams } from "react-router-dom"
import { Button } from "@workspace/ui/components/button.js"
import { ErrorFallback } from "@/lib/components/ErrorFallback"
import { FullPageLoader } from "@/lib/components/FullPageLoader"
import { Mode } from "./components/Mode"
import { Task } from "./components/Task/Task"
import { Workspace } from "./components/Workspace/Workspace"
import { usePairingDoc } from "./hooks/usePairingDoc"
import { StudioProvider } from "./providers/StudioProvider"

export default function Studio() {
    const { pairingId } = useParams()

    if (!pairingId) {
        return <Navigate to="/hub" replace />
    }

    return (
        <ErrorBoundary fallback={<ErrorFallback />}>
            <Suspense fallback={<FullPageLoader />}>
                <StudioProvider pairingId={pairingId}>
                    <StudioLayout />
                </StudioProvider>
            </Suspense>
        </ErrorBoundary>
    )
}

function StudioLayout() {
    return (
        <div className="h-screen flex flex-col">
            <Mode />
            <div className="flex-1 min-h-0 flex overflow-hidden">
                <Task />
                <Workspace />
            </div>
            <DevModeSwitcher />
        </div>
    )
}

// ============================================================================
// Dev Tools (remove in production)
// ============================================================================

function DevModeSwitcher() {
    const [isVisible, setIsVisible] = useState(true)
    const pairingDoc = usePairingDoc()

    if (!isVisible) {
        return (
            <Button
                size="sm"
                variant="outline"
                className="fixed bottom-4 right-4 z-50"
                onClick={() => setIsVisible(true)}
            >
                Show Dev Controls
            </Button>
        )
    }

    return (
        <div className="fixed bottom-4 right-4 flex gap-2 z-50 bg-background border rounded-lg p-2 shadow-lg">
            <Button
                size="sm"
                variant="outline"
                onClick={() => setIsVisible(false)}
            >
                ✕
            </Button>
            <Button size="sm" onClick={pairingDoc.store.advancePhase}>
                Advance Phase
            </Button>
        </div>
    )
}
