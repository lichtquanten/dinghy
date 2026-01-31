import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Navigate, useParams } from "react-router-dom"
import { Button } from "@workspace/ui/components/button.js"
import { ErrorFallback } from "@/lib/components/ErrorFallback"
import { LoadingSpinner } from "@/lib/components/LoadingSpinner"
import { trpc } from "@/lib/trpc"
import { Mode } from "./components/Mode"
import { Task } from "./components/Task/Task"
import { Workspace } from "./components/Workspace/Workspace"
import { useStudio } from "./hooks/StudioContext"
import { StudioProvider } from "./hooks/useStudio.js"

interface StudioContentProps {
    assignmentId: string
}

function StudioContent({ assignmentId }: StudioContentProps) {
    const { data: assignment } = useSuspenseQuery(
        trpc.assignment.get.queryOptions({
            id: assignmentId,
        })
    )

    if (!assignment) throw new Error("Assignment not found")

    return (
        <StudioProvider assignment={assignment}>
            <div className="h-screen flex flex-col">
                <Mode />
                <div className="flex-1 flex overflow-hidden">
                    <Task />
                    <Workspace />
                </div>
            </div>
            <DevModeSwitcher />
        </StudioProvider>
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
                <StudioContent assignmentId={assignmentId} />
            </Suspense>
        </ErrorBoundary>
    )
}

// Temporary dev controls for testing different modes
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
    const { setMode, currentMode } = useStudio()

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
