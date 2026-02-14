import { ArrowRight, PlayCircle, User, Users } from "lucide-react"
import type { RouterOutputs } from "@workspace/api"
import { Badge } from "@workspace/ui/components/badge.js"
import { Button } from "@workspace/ui/components/button.js"
import { Card, CardHeader, CardTitle } from "@workspace/ui/components/card.js"
import { cn } from "@workspace/ui/lib/utils.js"

type Assignment = RouterOutputs["assignment"]["getByCourse"][number]

function formatDueDate(dueDate: Date, isCompleted: boolean) {
    const now = new Date()
    const due = new Date(dueDate)
    const diffDays = Math.ceil(
        (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (isCompleted) {
        return {
            text: due.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year:
                    due.getFullYear() !== now.getFullYear()
                        ? "numeric"
                        : undefined,
            }),
            variant: "outline" as const,
        }
    }

    if (diffDays < 0) {
        return {
            text: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? "s" : ""}`,
            variant: "destructive" as const,
        }
    }
    if (diffDays === 0)
        return { text: "Due Today", variant: "destructive" as const }
    if (diffDays === 1)
        return { text: "Due Tomorrow", variant: "default" as const }

    return {
        text: due.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year:
                due.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
        }),
        variant: "outline" as const,
    }
}

function PartnerDisplay({ pairing }: { pairing: Assignment["pairing"] }) {
    if (!pairing) {
        return (
            <div className="flex items-center gap-1.5 text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="italic">
                    Waiting for instructor to assign a partner...
                </span>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>
                with{" "}
                <span className="font-medium text-foreground">
                    {pairing.partner.firstName} {pairing.partner.lastInitial}.
                </span>
            </span>
        </div>
    )
}

function DueDateDisplay({
    dueDate,
    isCompleted,
}: {
    dueDate: Date
    isCompleted: boolean
}) {
    const { text, variant } = formatDueDate(dueDate, isCompleted)
    return (
        <Badge
            variant={variant}
            className={cn("font-medium", isCompleted && "opacity-50")}
        >
            {isCompleted ? text : `Due: ${text}`}
        </Badge>
    )
}

function ActionButton({ isStarted }: { isStarted: boolean }) {
    return (
        <div className="transition-transform group-hover:rotate-12 group-hover:scale-110">
            <Button
                size="icon"
                className="w-12 h-12 rounded-full shrink-0 shadow-lg"
            >
                {isStarted ? (
                    <PlayCircle className="w-5 h-5" strokeWidth={2.5} />
                ) : (
                    <ArrowRight className="w-5 h-5" strokeWidth={3} />
                )}
            </Button>
        </div>
    )
}

interface AssignmentProps {
    assignment: Assignment
    onClick?: () => void
}

export function Assignment({ assignment, onClick }: AssignmentProps) {
    const { pairing, title, dueDate } = assignment

    const hasPartner = pairing !== null
    const isCompleted = pairing?.isCompleted ?? false
    const isStarted = pairing?.startedAt != null
    const isClickable = hasPartner && !isCompleted && Boolean(onClick)

    return (
        <div
            className={cn(
                "relative",
                isClickable &&
                    "group cursor-pointer transition-transform hover:scale-[1.02]",
                !hasPartner && "opacity-60"
            )}
            onClick={isClickable ? onClick : undefined}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
        >
            <Card
                className={cn(
                    "relative border overflow-hidden",
                    isCompleted ? "bg-muted/30" : "border-2 bg-background"
                )}
            >
                {isClickable && (
                    <div className="absolute inset-0 bg-linear-to-br from-foreground/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}

                <CardHeader className="p-6">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-2xl font-bold leading-tight">
                                    {title}
                                </CardTitle>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                                <PartnerDisplay pairing={pairing} />
                                <span className="text-muted-foreground/50">
                                    •
                                </span>
                                <DueDateDisplay
                                    dueDate={dueDate}
                                    isCompleted={isCompleted}
                                />
                            </div>
                        </div>

                        {!isCompleted && hasPartner && (
                            <ActionButton isStarted={isStarted} />
                        )}
                    </div>
                </CardHeader>
            </Card>
        </div>
    )
}
