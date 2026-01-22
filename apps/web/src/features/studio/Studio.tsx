import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { ErrorFallback } from "@/lib/components/ErrorFallback"
import { LoadingSpinner } from "@/lib/components/LoadingSpinner"
import { trpc } from "@/lib/trpc"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import Workspace from "./components/Workspace"
import { AssignmentProvider } from "./context"
import Ide from "./ide/Ide"

export type WorkspaceView = "ide"

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
    const [activeView, setActiveView] = useState<WorkspaceView>("ide")

    return (
        <AssignmentProvider assignment={assignment}>
            <div className="flex flex-1 gap-4 p-4 overflow-hidden">
                <Sidebar activeView={activeView} onViewChange={setActiveView} />
                <Workspace view={activeView}>
                    {{
                        ide: <Ide />,
                    }}
                </Workspace>
            </div>
        </AssignmentProvider>
    )
}

export default function Studio() {
    const navigate = useNavigate()
    const { assignmentId } = useParams()
    if (!assignmentId) {
        return <Navigate to="/hub" replace />
    }

    return (
        <div className="flex h-screen flex-col">
            <Header
                onBack={() => void navigate("/hub")}
                assignmentId={assignmentId}
            />
            <ErrorBoundary fallback={<ErrorFallback />}>
                <Suspense
                    fallback={
                        <div className="flex-1 flex items-center justify-center">
                            <LoadingSpinner />
                        </div>
                    }
                >
                    <StudioContent assignmentId={assignmentId} />
                </Suspense>
            </ErrorBoundary>
        </div>
    )
}
