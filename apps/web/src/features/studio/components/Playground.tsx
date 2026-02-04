import { useSuspenseQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Button } from "@workspace/ui/components/button.js"
import { useCodeExecution } from "@/lib/hooks/useCodeExecution"
import { trpc } from "@/lib/trpc"
import { useAssignmentId } from "../hooks/assignment"

type Result =
    | { type: "success"; output: string }
    | { type: "error"; message: string }

export function Playground() {
    const assignmentId = useAssignmentId()
    const { data: assignment } = useSuspenseQuery(
        trpc.assignment.get.queryOptions({ id: assignmentId })
    )

    const { run, isRunning } = useCodeExecution()
    const [stdin, setStdin] = useState("")
    const [result, setResult] = useState<Result | null>(null)

    const handleRun = async () => {
        setResult(null)

        const code = "FIX THIS"
        if (!code || code.trim() === "") {
            setResult({
                type: "error",
                message: "No code to run. Please write some code first.",
            })
            return
        }

        try {
            const { status, compileOutput, stderr, stdout } = await run({
                code,
                language: assignment.codeLanguage,
                stdin,
            })

            if (status === "compilation_error") {
                setResult({ type: "error", message: compileOutput })
            } else if (status === "runtime_error") {
                setResult({ type: "error", message: stderr })
            } else if (status === "success") {
                setResult({ type: "success", output: stdout || "(no output)" })
            } else {
                setResult({
                    type: "error",
                    message: `Unexpected status: ${status}`,
                })
            }
        } catch {
            setResult({
                type: "error",
                message:
                    "Failed to run code. Please check your Internet connection.",
            })
        }
    }

    return (
        <div className="flex flex-col gap-3 p-4 bg-white border-t">
            <div className="space-y-2">
                <label className="text-xs font-medium text-foreground block">
                    Standard Input (stdin)
                </label>
                <textarea
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    placeholder="Enter input for your program..."
                    className="w-full px-3 py-2 text-xs border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono"
                    rows={3}
                    disabled={isRunning}
                />
            </div>

            <Button
                onClick={handleRun}
                disabled={isRunning}
                size="sm"
                className="w-full"
            >
                {isRunning ? "Running..." : "Run Code"}
            </Button>

            {result && (
                <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground block">
                        Output
                    </label>
                    <div
                        className={`w-full px-3 py-2 text-xs border rounded-md font-mono whitespace-pre-wrap ${
                            result.type === "error"
                                ? "bg-red-50 border-red-200 text-red-700"
                                : "bg-slate-50 border-border text-foreground"
                        }`}
                    >
                        {result.type === "error"
                            ? result.message
                            : result.output}
                    </div>
                </div>
            )}
        </div>
    )
}
