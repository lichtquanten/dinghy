import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense, useEffect, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Spinner } from "@workspace/ui/components/spinner.tsx"
import { trpc } from "@/lib/trpc"
import Ai from "./ai/Ai"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import Workspace from "./components/Workspace"
import { AssignmentProvider } from "./context"
import Ide from "./ide/Ide"

const assignmentSlug = "string-length"
export type WorkspaceView = "ide" | "ai"

const loadingMessages = [
    "Charging the flux capacitor...",
    "Downloading more RAM...",
    "Consulting the rubber duck...",
    "Herding cats...",
    "Asking Stack Overflow...",
]

function LoadingSpinner() {
    const [messageIndex, setMessageIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex flex-col items-center gap-6">
            <Spinner className="size-16 text-primary" />
            <div className="h-8 flex items-center justify-center min-w-[300px]">
                <p
                    key={messageIndex}
                    className="text-muted-foreground text-lg font-medium animate-in fade-in-0 zoom-in-95 duration-500"
                >
                    {loadingMessages[messageIndex]}
                </p>
            </div>
        </div>
    )
}

function StudioContent() {
    const { data: assignment } = useSuspenseQuery(
        trpc.assignment.getBySlug.queryOptions({
            slug: assignmentSlug,
        })
    )
    const [activeView, setActiveView] = useState<WorkspaceView>("ide")

    return (
        <AssignmentProvider assignment={assignment}>
            <div className="flex flex-1 gap-4 p-4 overflow-hidden">
                <Sidebar activeView={activeView} onViewChange={setActiveView} />
                <Workspace view={activeView}>
                    {{
                        ide: <Ide />,
                        ai: <Ai />,
                    }}
                </Workspace>
            </div>
        </AssignmentProvider>
    )
}

function ErrorFallback() {
    return (
        <div className="flex-1 flex items-center justify-center bg-background">
            <div className="text-center">
                <p className="text-destructive text-lg font-semibold">
                    Failed to load assignment
                </p>
                <p className="text-muted-foreground mt-2">
                    Please check your connection and try again
                </p>
            </div>
        </div>
    )
}

export default function Studio() {
    return (
        <div className="flex h-screen flex-col">
            <Header assignmentSlug={assignmentSlug} />
            <ErrorBoundary fallback={<ErrorFallback />}>
                <Suspense
                    fallback={
                        <div className="flex-1 flex items-center justify-center">
                            <LoadingSpinner />
                        </div>
                    }
                >
                    <StudioContent />
                </Suspense>
            </ErrorBoundary>
        </div>
    )
}
