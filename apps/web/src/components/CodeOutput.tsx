// src/components/CodeOutput.tsx
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card.tsx"
import { Alert, AlertDescription } from "@workspace/ui/components/alert.tsx"
import { Loader2, Terminal, AlertCircle } from "lucide-react"
import type { SubmissionResult } from "@/types/judge0"

interface CodeOutputProps {
    result: SubmissionResult | null
    isLoading: boolean
    error: string | null
}

// src/components/CodeOutput.tsx
export const CodeOutput = ({ result, isLoading, error }: CodeOutputProps) => {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Output</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {error && <ErrorView />}
                {isLoading && <LoadingView />}
                {result && !isLoading && <ResultView result={result} />}
                {!result && !isLoading && !error && <EmptyView />}
            </CardContent>
        </Card>
    )
}

const ErrorView = () => (
    <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
            Failed to connect to server or process request.
        </AlertDescription>
    </Alert>
)

const LoadingView = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Executing code...</p>
    </div>
)

const EmptyView = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 text-muted-foreground">
        <Terminal className="h-12 w-12 opacity-20" />
        <p className="text-sm">Run your code to see the output</p>
    </div>
)

const ResultView = ({ result }: { result: SubmissionResult }) => {
    const hasOutput = result.stdout || result.stderr || result.compile_output

    if (!hasOutput) {
        return (
            <Alert>
                <Terminal className="h-4 w-4" />
                <AlertDescription>No output generated</AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="space-y-4">
            {result.stdout && (
                <OutputSection
                    icon={Terminal}
                    title="Standard Output"
                    content={result.stdout}
                    variant="success"
                />
            )}
            {result.stderr && (
                <OutputSection
                    icon={AlertCircle}
                    title="Standard Error"
                    content={result.stderr}
                    variant="error"
                />
            )}
            {result.compile_output && (
                <OutputSection
                    icon={AlertCircle}
                    title="Compile Output"
                    content={result.compile_output}
                    variant="warning"
                />
            )}
        </div>
    )
}

const OutputSection = ({
    icon: Icon,
    title,
    content,
    variant,
}: {
    icon: React.ComponentType<{ className?: string }>
    title: string
    content: string
    variant: "success" | "error" | "warning"
}) => {
    const styles = {
        success: {
            icon: "text-green-500",
            container: "bg-muted/30 border",
        },
        error: {
            icon: "text-red-500",
            container:
                "bg-destructive/10 border border-destructive/20 text-destructive-foreground",
        },
        warning: {
            icon: "text-yellow-500",
            container: "bg-yellow-500/10 border border-yellow-500/20",
        },
    }[variant]

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${styles.icon}`} />
                <h3 className="text-sm font-semibold">{title}</h3>
            </div>
            <pre
                className={`p-4 rounded-lg text-sm font-mono whitespace-pre-wrap overflow-x-auto ${styles.container}`}
            >
                {content}
            </pre>
        </div>
    )
}
