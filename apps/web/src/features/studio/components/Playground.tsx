import { useState } from "react"
import { Button } from "@workspace/ui/components/button.js"
import { useCodeExecution } from "@/lib/judge0/hooks/useCodeExecution"
import { useStudio } from "../hooks/StudioContext"

export function Playground() {
    const { assignment, myCode } = useStudio()
    const {
        executeCode,
        isLoading,
        isConnected,
        error: executionError,
    } = useCodeExecution()

    const [stdin, setStdin] = useState("")
    const [output, setOutput] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const runCode = async () => {
        if (!isConnected) {
            setError(
                "Not connected to the server. Please check your Internet connection."
            )
            return
        }
        if (!myCode || myCode.trim() === "") {
            setError("No code to run. Please write some code first.")
            return
        }

        setOutput(null)
        setError(null)

        try {
            const result = await executeCode(
                myCode,
                assignment.codeLanguage,
                stdin
            )

            if (result.stdout) {
                setOutput(result.stdout)
            } else if (result.stderr) {
                setError(result.stderr)
            } else if (result.compile_output) {
                setError(result.compile_output)
            } else {
                setOutput("(no output)")
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to execute code"
            )
        }
    }

    const displayError =
        error ||
        (executionError ? "Unable to run code. Please try again." : null)
    const hasOutput = output !== null || displayError !== null

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
                />
            </div>

            <Button
                onClick={runCode}
                disabled={isLoading || !isConnected}
                size="sm"
                className="w-full"
            >
                {isLoading ? "Running..." : "Run Code"}
            </Button>

            {hasOutput && (
                <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground block">
                        Output
                    </label>
                    <div
                        className={`w-full px-3 py-2 text-xs border rounded-md font-mono whitespace-pre-wrap ${
                            displayError
                                ? "bg-red-50 border-red-200 text-red-700"
                                : "bg-slate-50 border-border text-foreground"
                        }`}
                    >
                        {displayError || output}
                    </div>
                </div>
            )}
        </div>
    )
}
