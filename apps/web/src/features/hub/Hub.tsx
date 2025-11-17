// Hub.tsx
import { UserButton } from "@clerk/clerk-react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { CheckCircle2, Clock } from "lucide-react"
import { Suspense, useCallback } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Navigate, useNavigate } from "react-router-dom"
import { generatePath } from "react-router-dom"
import type { RouterOutputs } from "@workspace/api"
import { ErrorFallback } from "@/lib/components/ErrorFallback"
import { LoadingSpinner } from "@/lib/components/LoadingSpinner"
import { trpc } from "@/lib/trpc"
import { Assignment } from "./components/Assignment"
import { AssignmentGroup } from "./components/AssignmentGroup"

type Assignment = RouterOutputs["assignment"]["getByCourse"][number]

function EmptyTodoState() {
    return (
        <div className="py-20 text-center">
            <CheckCircle2 className="w-20 h-20 mx-auto mb-6 text-foreground" />
            <p className="text-4xl font-bold mb-3">All Caught Up</p>
            <p className="text-muted-foreground text-lg">
                No pending assignments
            </p>
        </div>
    )
}

function EmptyCompletedState() {
    return (
        <div className="py-20 text-center">
            <CheckCircle2 className="w-20 h-20 mx-auto mb-6 text-foreground" />
            <p className="text-4xl font-bold mb-3">Soon!</p>
            <p className="text-muted-foreground text-lg">
                No completed assignments yet
            </p>
        </div>
    )
}

function HubContent() {
    const { data: courses } = useSuspenseQuery(trpc.course.get.queryOptions())
    const navigate = useNavigate()
    const [course] = courses

    const { data: assignments } = useSuspenseQuery(
        trpc.assignment.getByCourse.queryOptions(
            { courseId: course!.id },
            { enabled: !!course?.id }
        )
    )

    const handleAssignmentClick = useCallback(
        async (assignmentId: string) => {
            const path = generatePath("/studio/:assignmentId", { assignmentId })
            await navigate(path)
        },
        [navigate]
    )

    if (courses.length > 1) {
        throw new Error("Enrollment in multiple courses not supported.")
    }

    if (!course) {
        return <Navigate to="/joinCourse" replace />
    }

    const todoAssignments = assignments.filter((a) => !a.isSubmitted)
    const completedAssignments = assignments.filter((a) => a.isSubmitted)

    return (
        <div className="max-w-6xl mx-auto px-8 py-16">
            <div className="mb-16 text-center">
                <h1 className="text-6xl font-black tracking-tight">
                    {course.title}
                </h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <AssignmentGroup
                    title="To Do"
                    icon={<Clock className="w-7 h-7" />}
                    emptyState={
                        todoAssignments.length === 0 ? (
                            <EmptyTodoState />
                        ) : undefined
                    }
                >
                    <div className="space-y-6">
                        {todoAssignments.map((assignment) => (
                            <Assignment
                                key={assignment.id}
                                assignment={assignment}
                                onClick={() =>
                                    handleAssignmentClick(assignment.id)
                                }
                            />
                        ))}
                    </div>
                </AssignmentGroup>
                <AssignmentGroup
                    title="Completed"
                    icon={<CheckCircle2 className="w-7 h-7" />}
                    emptyState={
                        completedAssignments.length === 0 ? (
                            <EmptyCompletedState />
                        ) : undefined
                    }
                >
                    <div className="space-y-6">
                        {completedAssignments.map((assignment) => (
                            <Assignment
                                key={assignment.id}
                                assignment={assignment}
                                isCompleted
                            />
                        ))}
                    </div>
                </AssignmentGroup>
            </div>
        </div>
    )
}

export default function Hub() {
    return (
        <div className="min-h-screen bg-background">
            <div className="fixed top-4 right-4 z-50">
                <UserButton />
            </div>
            <ErrorBoundary fallback={<ErrorFallback />}>
                <Suspense
                    fallback={
                        <div className="flex min-h-screen items-center justify-center">
                            <LoadingSpinner />
                        </div>
                    }
                >
                    <HubContent />
                </Suspense>
            </ErrorBoundary>
        </div>
    )
}
