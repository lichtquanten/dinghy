import { UserButton } from "@clerk/clerk-react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { CheckCircle2, Clock, Plus } from "lucide-react"
import { Suspense, useCallback, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { generatePath, Navigate, useNavigate } from "react-router-dom"
import { Button } from "@workspace/ui/components/button.js"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select.js"
import { ErrorFallback } from "@/lib/components/ErrorFallback"
import { LoadingSpinner } from "@/lib/components/LoadingSpinner"
import { trpc } from "@/lib/trpc"
import { Assignment } from "./components/Assignment"
import { AssignmentGroup } from "./components/AssignmentGroup"

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
    const navigate = useNavigate()

    const { data: courses } = useSuspenseQuery(trpc.course.get.queryOptions())

    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
        null
    )

    const activeCourse =
        courses.find((c) => c.id === selectedCourseId) ?? courses[0] ?? null

    const { data: assignments } = useSuspenseQuery(
        trpc.assignment.getByCourse.queryOptions(
            { courseId: activeCourse?.id ?? "" },
            { enabled: Boolean(activeCourse?.id) }
        )
    )

    const handleAssignmentClick = useCallback(
        (assignmentId: string) => {
            const path = generatePath("/studio/:assignmentId", { assignmentId })
            void navigate(path)
        },
        [navigate]
    )

    if (courses.length === 0) {
        return <Navigate to="/joinCourse" replace />
    }

    if (!activeCourse) {
        return null
    }

    const todoAssignments = assignments.filter((a) => !a.pairing?.isCompleted)
    const completedAssignments = assignments.filter((a) =>
        Boolean(a.pairing?.isCompleted)
    )

    return (
        <div className="max-w-6xl mx-auto px-8 py-16">
            <div className="mb-16 text-center space-y-6">
                <h1 className="text-6xl font-black tracking-tight">
                    {activeCourse.title}
                </h1>

                <div className="flex items-center justify-center gap-3">
                    {courses.length > 1 && (
                        <>
                            <span className="text-sm text-muted-foreground">
                                Course
                            </span>

                            <Select
                                value={activeCourse.id}
                                onValueChange={setSelectedCourseId}
                            >
                                <SelectTrigger className="w-65">
                                    <SelectValue placeholder="Select a course" />
                                </SelectTrigger>

                                <SelectContent>
                                    {courses.map((course) => (
                                        <SelectItem
                                            key={course.id}
                                            value={course.id}
                                        >
                                            <span className="truncate">
                                                {course.title}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </>
                    )}

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate("/joinCourse")}
                        title="Join another course"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
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
