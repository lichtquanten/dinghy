import { LiveblocksProvider, RoomProvider } from "@liveblocks/react"
import { createStore, Provider, useAtomValue, useSetAtom } from "jotai"
import { Suspense, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Navigate, useParams } from "react-router-dom"
import { RoomId } from "@workspace/collab"
import { Button } from "@workspace/ui/components/button.js"
import { ErrorFallback } from "@/lib/components/ErrorFallback"
import { LoadingSpinner } from "@/lib/components/LoadingSpinner"
import { currentModeAtom, setModeAtom, startTimeAtom } from "./atoms"
import { Mode } from "./components/Mode"
import { Task } from "./components/Task/Task"
import { Workspace } from "./components/Workspace/Workspace"
import { YjsProvider } from "./contexts/YjsProvider"
import { useStudioTimer } from "./hooks/useStudioTimer"

// ============================================================================
// Main Export
// ============================================================================

export default function Studio() {
    const { pairingId } = useParams()

    if (!pairingId) {
        return <Navigate to="/hub" replace />
    }

    return (
        <ErrorBoundary fallback={<ErrorFallback />}>
            <Suspense fallback={<FullPageLoader />}>
                <StudioProviders pairingId={pairingId} />
            </Suspense>
        </ErrorBoundary>
    )
}

// ============================================================================
// Providers & Layout
// ============================================================================

function StudioProviders({ pairingId }: { pairingId: string }) {
    const [store] = useState(() => {
        const s = createStore()
        s.set(startTimeAtom, Date.now())
        return s
    })
    const roomId = RoomId.fromPairingId(pairingId)

    return (
        <Provider store={store}>
            <LiveblocksProvider
                authEndpoint="/api/liveblocks/token"
                badgeLocation="bottom-left"
            >
                <RoomProvider id={roomId}>
                    <YjsProvider>
                        <StudioLayout />
                    </YjsProvider>
                </RoomProvider>
            </LiveblocksProvider>
        </Provider>
    )
}

function StudioLayout() {
    useStudioTimer()

    return (
        <div className="h-screen flex flex-col">
            <Mode />
            <div className="flex-1 flex overflow-hidden">
                <Task />
                <Workspace />
            </div>
            <DevModeSwitcher />
        </div>
    )
}

// ============================================================================
// Shared Components
// ============================================================================

function FullPageLoader() {
    return (
        <div className="flex-1 flex items-center justify-center h-screen">
            <LoadingSpinner />
        </div>
    )
}

// ============================================================================
// Dev Tools (remove in production)
// ============================================================================

function DevModeSwitcher() {
    const [isVisible, setIsVisible] = useState(true)

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
            <ModeButtons />
        </div>
    )
}

function ModeButtons() {
    const currentMode = useAtomValue(currentModeAtom)
    const setMode = useSetAtom(setModeAtom)

    const modes = [
        { value: "solo", label: "Solo" },
        { value: "review", label: "Review" },
        { value: "collaborative", label: "Collab" },
    ] as const

    return (
        <>
            {modes.map(({ value, label }) => (
                <Button
                    key={value}
                    size="sm"
                    variant={currentMode === value ? "default" : "outline"}
                    onClick={() => setMode(value)}
                >
                    {label}
                </Button>
            ))}
        </>
    )
}
