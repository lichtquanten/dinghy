import { createStore, Provider, useAtomValue, useSetAtom } from "jotai"
import { Suspense, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Navigate, useParams } from "react-router-dom"
import { Button } from "@workspace/ui/components/button.js"
import { ErrorFallback } from "@/lib/components/ErrorFallback"
import { LoadingSpinner } from "@/lib/components/LoadingSpinner"
import {
    currentModeAtom,
    myCodeAtom,
    setModeAtom,
    startTimeAtom,
} from "./atoms"
import { Mode } from "./components/Mode"
import { Task } from "./components/Task/Task"
import { Workspace } from "./components/Workspace/Workspace"
import { useAssignment } from "./hooks/assignment"
import { useStudioTimer } from "./hooks/useStudioTimer"

function StudioContent() {
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

function StudioInitializer() {
    const { data: assignment } = useAssignment()

    const [store] = useState(() => {
        const s = createStore()
        s.set(myCodeAtom, assignment.starterCode)
        s.set(startTimeAtom, Date.now())
        return s
    })

    return (
        <Provider store={store}>
            <StudioContent />
        </Provider>
    )
}

export default function Studio() {
    const { assignmentId } = useParams()

    if (!assignmentId) {
        return <Navigate to="/hub" replace />
    }

    return (
        <ErrorBoundary fallback={<ErrorFallback />}>
            <Suspense
                fallback={
                    <div className="flex-1 flex items-center justify-center h-screen">
                        <LoadingSpinner />
                    </div>
                }
            >
                <StudioInitializer key={assignmentId} />
            </Suspense>
        </ErrorBoundary>
    )
}

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

    return (
        <>
            <Button
                size="sm"
                variant={currentMode === "solo" ? "default" : "outline"}
                onClick={() => setMode("solo")}
            >
                Solo
            </Button>
            <Button
                size="sm"
                variant={currentMode === "review" ? "default" : "outline"}
                onClick={() => setMode("review")}
            >
                Review
            </Button>
            <Button
                size="sm"
                variant={
                    currentMode === "collaborative" ? "default" : "outline"
                }
                onClick={() => setMode("collaborative")}
            >
                Collab
            </Button>
        </>
    )
}
