import { Play } from "lucide-react"
import { useState } from "react"
import type { AssignmentPublic } from "@workspace/database"
import { Button } from "@workspace/ui/components/button.tsx"
import { useCodeExecution } from "@/lib/judge0/hooks/useCodeExecution"
import { CodeEditor } from "./components/CodeEditor"
import { CodeOutput } from "./components/CodeOutput"
import { ConnectionStatus } from "./components/ConnectionStatus"
import { StdinInput } from "./components/StdinInput"
import { useCode } from "./hooks/useCode"
import { useCodeAutoSave } from "./hooks/useCodeAutoSave"

interface Props {
    assignment: AssignmentPublic
}

export default function Ide({ assignment }: Props) {
    const { code, setCode } = useCode(assignment)
    const { isSaving, isSaved } = useCodeAutoSave(assignment.slug, code)

    const [stdin, setStdin] = useState("")

    const { executeCode, result, isLoading, error, isConnected } =
        useCodeExecution({
            onTimeout: (submissionId) => {
                console.error("Execution timeout for submission:", submissionId)
            },
        })

    const handleRunCode = () => {
        void executeCode(code, assignment.codeLanguage, stdin)
    }

    return (
        <div className="grid gap-4 md:gap-6 grid-rows-[auto_1fr] [grid-template-columns:minmax(0,1fr)] lg:[grid-template-columns:minmax(0,1fr)_minmax(0,1fr)] h-full">
            {/* Toolbar */}
            <div className="col-span-1 lg:col-span-2 sticky top-0 bg-background z-10">
                <div className="flex items-center gap-3">
                    <div className="text-sm">
                        {isSaving && (
                            <span className="text-muted-foreground">
                                Saving...
                            </span>
                        )}
                        {isSaved && (
                            <span className="text-green-600">Saved ✓</span>
                        )}
                    </div>
                    <ConnectionStatus isConnected={isConnected} />
                    <Button
                        onClick={handleRunCode}
                        disabled={isLoading || !isConnected}
                        className="gap-2"
                    >
                        {isLoading ? (
                            <>Running...</>
                        ) : (
                            <>
                                <Play className="h-4 w-4" />
                                Run Code
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Code Editor */}
            <section className="min-h-0 flex flex-col">
                <div className="min-h-0 flex-1 overflow-auto rounded-md border">
                    <CodeEditor
                        code={code}
                        onCodeChange={setCode}
                        language={assignment.codeLanguage}
                    />
                </div>
            </section>

            {/* Input/Output */}
            <section className="min-h-0 flex flex-col gap-3 md:gap-4">
                <StdinInput stdin={stdin} onStdinChange={setStdin} />
                <div
                    className="min-h-0 flex-1 overflow-auto rounded-md border"
                    aria-busy={isLoading}
                    role="status"
                    aria-live="polite"
                >
                    <CodeOutput
                        result={result}
                        isLoading={isLoading}
                        error={error}
                    />
                </div>
            </section>
        </div>
    )
}
