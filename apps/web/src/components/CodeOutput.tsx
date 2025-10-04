// src/components/CodeOutput.tsx
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { Badge } from "@workspace/ui/components/badge"
import { Loader2, Terminal, AlertCircle, CheckCircle2 } from "lucide-react"
import type { SubmissionResult } from "../types/judge0"
import { isSuccess, isError } from "../utils/judge0"
import type { Status } from "../types/judge0"

interface CodeOutputProps {
    result: SubmissionResult | null
    isLoading: boolean
    error: string | null
}

export const CodeOutput = ({ result, isLoading, error }: CodeOutputProps) => {
    const getStatusVariant = (status: Status) => {
        if (isSuccess(status)) return "default"
        if (isError(status)) return "destructive"
        return "secondary"
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Output</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            Executing code...
                        </p>
                    </div>
                )}

                {result && !isLoading && (
                    <div className="space-y-4">
                        {/* Status Bar */}
                        <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                    Status:
                                </span>
                                <Badge
                                    variant={
                                        result.status
                                            ? getStatusVariant(result.status)
                                            : "default"
                                    }
                                >
                                    {result.status?.id === 3 && (
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                    )}
                                    {result.status?.description}
                                </Badge>
                            </div>
                        </div>

                        {/* Standard Output */}
                        {result.stdout && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Terminal className="h-4 w-4 text-green-500" />
                                    <h3 className="text-sm font-semibold">
                                        Standard Output
                                    </h3>
                                </div>
                                <pre className="p-4 bg-muted/30 border rounded-lg text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                                    {result.stdout}
                                </pre>
                            </div>
                        )}

                        {/* Standard Error */}
                        {result.stderr && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                    <h3 className="text-sm font-semibold">
                                        Standard Error
                                    </h3>
                                </div>
                                <pre className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm font-mono whitespace-pre-wrap overflow-x-auto text-destructive-foreground">
                                    {result.stderr}
                                </pre>
                            </div>
                        )}

                        {/* Compile Output */}
                        {result.compile_output && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                                    <h3 className="text-sm font-semibold">
                                        Compile Output
                                    </h3>
                                </div>
                                <pre className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                                    {result.compile_output}
                                </pre>
                            </div>
                        )}

                        {!result.stdout &&
                            !result.stderr &&
                            !result.compile_output && (
                                <Alert>
                                    <Terminal className="h-4 w-4" />
                                    <AlertDescription>
                                        No output generated
                                    </AlertDescription>
                                </Alert>
                            )}
                    </div>
                )}

                {!result && !isLoading && !error && (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4 text-muted-foreground">
                        <Terminal className="h-12 w-12 opacity-20" />
                        <p className="text-sm">
                            Run your code to see the output
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
