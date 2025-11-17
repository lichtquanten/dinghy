// Header.tsx
import { UserButton } from "@clerk/clerk-react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ArrowLeft, HelpCircle } from "lucide-react"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Button } from "@workspace/ui/components/button.tsx"
import { trpc } from "@/lib/trpc"

type HeaderProps = {
    title: string | React.ReactNode
    onBack?: () => void
}

function HeaderShell({ title, onBack }: HeaderProps) {
    return (
        <header className="h-12 border-b border-border flex items-center justify-between px-4 bg-white shadow-sm">
            <div className="flex items-center gap-2">
                {onBack && (
                    <Button
                        onClick={onBack}
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                    >
                        <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                    </Button>
                )}
                <h1 className="text-sm font-medium text-foreground">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    title="Help"
                >
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </Button>
                <UserButton />
            </div>
        </header>
    )
}

type HeaderContentProps = {
    assignmentId: string
}

function HeaderContent({ assignmentId }: HeaderContentProps) {
    const { data: assignment } = useSuspenseQuery(
        trpc.assignment.get.queryOptions({
            id: assignmentId,
        })
    )

    if (!assignment) throw new Error("Assignment not found")

    return assignment.title
}

type Props = {
    assignmentId: string
    onBack?: () => void
}

export default function Header({ assignmentId, onBack }: Props) {
    return (
        <ErrorBoundary fallback={<HeaderShell title="" onBack={onBack} />}>
            <HeaderShell
                title={
                    <Suspense fallback="Loading...">
                        <HeaderContent assignmentId={assignmentId} />
                    </Suspense>
                }
                onBack={onBack}
            />
        </ErrorBoundary>
    )
}
