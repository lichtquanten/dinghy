import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Skeleton } from "@workspace/ui/components/skeleton.tsx"
import { trpc } from "@/lib/trpc"
import Ai from "./ai/Ai"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import Workspace from "./components/Workspace"
import { AssignmentProvider } from "./context"
import Ide from "./ide/Ide"

const assignmentSlug = "string-length"

export type WorkspaceView = "ide" | "ai"

function StudioContent() {
    const { data: assignment } = useSuspenseQuery(
        trpc.assignment.getBySlug.queryOptions({
            slug: assignmentSlug,
        })
    )

    const [activeView, setActiveView] = useState<WorkspaceView>("ide")

    return (
        <AssignmentProvider assignment={assignment}>
            <div className="flex h-screen flex-col">
                <Header />

                <div className="flex flex-1 gap-4 p-4 overflow-hidden">
                    <Sidebar
                        activeView={activeView}
                        onViewChange={setActiveView}
                    />

                    <Workspace view={activeView}>
                        {{
                            ide: <Ide />,
                            ai: <Ai />,
                        }}
                    </Workspace>
                </div>
            </div>
        </AssignmentProvider>
    )
}

export default function Studio() {
    return (
        <ErrorBoundary
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="text-center">
                        <p className="text-destructive text-lg font-semibold">
                            Failed to load assignment
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Please check your connection and try again
                        </p>
                    </div>
                </div>
            }
        >
            <Suspense
                fallback={
                    <div className="min-h-screen flex items-center justify-center">
                        <Skeleton className="h-[90vh] w-[95vw] rounded-lg" />
                    </div>
                }
            >
                <StudioContent />
            </Suspense>
        </ErrorBoundary>
    )
}
