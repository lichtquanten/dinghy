import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Navigate, useParams } from "react-router-dom"
import { ErrorFallback } from "@/lib/components/ErrorFallback"
import { FullPageLoader } from "@/lib/components/FullPageLoader"
import { useSelf } from "@/lib/hooks/useSelf"
import { Mode } from "./components/Mode"
import { PairingGate } from "./components/PairingGate"
import { Task } from "./components/Task/Task"
import { WherebyEmbed } from "./components/WherebyEmbed"
import { Workspace } from "./components/Workspace/Workspace"
import { StudioProvider } from "./providers/StudioProvider"

export default function Studio() {
    const { pairingId } = useParams()

    if (!pairingId) {
        return <Navigate to="/hub" replace />
    }

    return (
        <ErrorBoundary fallback={<ErrorFallback />}>
            <Suspense fallback={<FullPageLoader />}>
                <StudioProvider>
                    <PairingGate>
                        <StudioLayout />
                    </PairingGate>
                </StudioProvider>
            </Suspense>
        </ErrorBoundary>
    )
}

function StudioLayout() {
    const self = useSelf()
    return (
        <div className="h-screen flex flex-col">
            <Mode />
            <div className="flex-1 min-h-0 flex overflow-hidden">
                <Task />
                <Workspace />
            </div>
            <WherebyEmbed mode="audio-only" displayName={self.firstName} />
        </div>
    )
}
