// components/panels/Playground.tsx
import { useState } from "react"
import { useAssignment } from "@/features/studio/context"
import { useCodeExecution } from "@/lib/judge0/hooks/useCodeExecution"

interface PlaygroundProps {
    code: string
}

export default function Playground({ code }: PlaygroundProps) {
    const assignment = useAssignment()
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
        if (!code || code.trim() === "") {
            setError("No code to run. Please write some code first.")
            return
        }

        setOutput(null)
        setError(null)

        try {
            const result = await executeCode(
                code,
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
        <div className="px-4 py-3 space-y-3 bg-white">
            <div className="space-y-2">
                <label className="text-xs font-medium text-foreground block">
                    Standard Input (stdin)
                </label>
                <textarea
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    placeholder="Enter input for your program..."
                    className="w-full px-3 py-2 text-xs border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono"
                    rows={4}
                />
            </div>

            <button
                onClick={runCode}
                disabled={isLoading || !isConnected}
                className="w-full text-xs px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? "Running..." : "Run Code"}
            </button>

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
