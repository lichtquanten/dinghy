import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Play } from "lucide-react"
import { useCodeExecution } from "@/hooks/useCodeExecution"
import { DEFAULT_CODE, DEFAULT_CODE_LANGUAGE } from "@/config/consts"
import { LanguageSelector } from "@/components/LanguageSelector"
import { CodeEditor } from "@/components/CodeEditor"
import { StdinInput } from "@/components/StdinInput"
import { CodeOutput } from "@/components/CodeOutput"
import { ConnectionStatus } from "@/components/ConnectionStatus"

export const IdePanel = () => {
    const [code, setCode] = useState(DEFAULT_CODE)
    const [codeLanguage, setCodeLanguage] = useState(DEFAULT_CODE_LANGUAGE)
    const [stdin, setStdin] = useState("")

    const { executeCode, result, isLoading, error, isConnected } =
        useCodeExecution({
            onTimeout: (submissionId) => {
                console.error("Execution timeout for submission:", submissionId)
            },
        })

    const handleRunCode = () => {
        executeCode(code, codeLanguage, stdin)
    }

    return (
        <div className="grid gap-4 md:gap-6 grid-rows-[auto_1fr] [grid-template-columns:minmax(0,1fr)] lg:[grid-template-columns:minmax(0,1fr)_minmax(0,1fr)] h-full">
            {/* Toolbar */}
            <div className="col-span-1 lg:col-span-2 sticky top-0 bg-background z-10">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-between">
                    <div className="w-full sm:w-auto">
                        <LanguageSelector
                            language={codeLanguage}
                            onChange={setCodeLanguage}
                        />
                    </div>

                    <div className="flex items-center gap-3">
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
            </div>

            {/* Code Editor */}
            <section className="min-h-0 flex flex-col">
                <div className="min-h-0 flex-1 overflow-auto rounded-md border">
                    <CodeEditor
                        code={code}
                        onCodeChange={setCode}
                        language={codeLanguage}
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
