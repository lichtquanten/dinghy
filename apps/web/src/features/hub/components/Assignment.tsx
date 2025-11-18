import { ArrowRight, CheckCircle2, Clock, PlayCircle } from "lucide-react"
import type { RouterOutputs } from "@workspace/api"
import { Badge } from "@workspace/ui/components/badge.js"
import { Button } from "@workspace/ui/components/button.js"
import { Card, CardHeader, CardTitle } from "@workspace/ui/components/card.js"
import { cn } from "@workspace/ui/lib/utils.js"

type Assignment = RouterOutputs["assignment"]["getByCourse"][number]

function formatDueDate(dueDate: Date) {
    const now = new Date()
    const dueDateObj = new Date(dueDate)
    const diffTime = dueDateObj.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
        return {
            text: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? "s" : ""}`,
            variant: "destructive" as const,
        }
    }
    if (diffDays === 0) {
        return { text: "Due Today", variant: "destructive" as const }
    }
    if (diffDays === 1) {
        return { text: "Due Tomorrow", variant: "default" as const }
    }
    if (diffDays <= 3) {
        return { text: `Due in ${diffDays} days`, variant: "default" as const }
    }
    if (diffDays <= 7) {
        return {
            text: `Due in ${diffDays} days`,
            variant: "secondary" as const,
        }
    }
    return {
        text: dueDateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year:
                dueDateObj.getFullYear() !== now.getFullYear()
                    ? "numeric"
                    : undefined,
        }),
        variant: "outline" as const,
    }
}

interface AssignmentProps {
    assignment: Assignment
    isCompleted?: boolean
    onClick?: () => void
}

export function Assignment({
    assignment,
    isCompleted = false,
    onClick,
}: AssignmentProps) {
    const dueDate = formatDueDate(assignment.dueDate)
    const StatusIcon = isCompleted
        ? CheckCircle2
        : assignment.isStarted
          ? PlayCircle
          : Clock
    const statusText = isCompleted
        ? "Submitted"
        : assignment.isStarted
          ? "In Progress"
          : "Not Started"
    const statusVariant = isCompleted
        ? "outline"
        : assignment.isStarted
          ? "secondary"
          : "outline"

    return (
        <div
            className={cn(
                "relative",
                !isCompleted &&
                    "group cursor-pointer transition-transform hover:scale-[1.02]"
            )}
            onClick={!isCompleted ? onClick : undefined}
        >
            <Card
                className={cn(
                    "relative border overflow-hidden",
                    isCompleted
                        ? "bg-muted/30 backdrop-blur-sm"
                        : "border-2 bg-background"
                )}
            >
                {!isCompleted && (
                    <div className="absolute inset-0 bg-linear-to-br from-foreground/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}

                <CardHeader className="p-6">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex items-center gap-3">
                                {isCompleted && (
                                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                                )}
                                <CardTitle className="text-2xl font-bold leading-tight">
                                    {assignment.title}
                                </CardTitle>
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                                <div className="space-y-1">
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                                        Status
                                    </div>
                                    <Badge
                                        variant={statusVariant}
                                        className="font-semibold"
                                    >
                                        <StatusIcon className="w-3 h-3 mr-1.5" />
                                        {statusText}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                                        Due Date
                                    </div>
                                    {isCompleted ? (
                                        <span className="text-muted-foreground font-medium">
                                            {new Date(
                                                assignment.dueDate
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                    ) : (
                                        <Badge
                                            variant={dueDate.variant}
                                            className="font-semibold"
                                        >
                                            {dueDate.text}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {!isCompleted && (
                            <div className="transition-transform group-hover:rotate-12 group-hover:scale-110">
                                <Button
                                    size="icon"
                                    className="w-12 h-12 rounded-full shrink-0 shadow-lg"
                                >
                                    <ArrowRight
                                        className="w-5 h-5"
                                        strokeWidth={3}
                                    />
                                </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>
            </Card>
        </div>
    )
}
