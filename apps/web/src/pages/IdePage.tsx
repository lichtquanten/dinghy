// src/pages/IdePage.tsx
import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Play, Code2 } from "lucide-react"
import { useSse } from "../hooks/useSse"
import { submitCode } from "../api/judge0"
import { DEFAULT_CODE, DEFAULT_LANGUAGE_ID } from "../config/consts"
import { LanguageSelector } from "../components/LanguageSelector"
import { CodeEditor } from "../components/CodeEditor"
import { CodeOutput } from "../components/CodeOutput"
import { ConnectionStatus } from "../components/ConnectionStatus"
import type { SubmissionResult } from "../types/judge0"
import { SseMessageSchema } from "../types/judge0"

export const IdePage = () => {
    const [code, setCode] = useState(DEFAULT_CODE)
    const [languageId, setLanguageId] = useState(DEFAULT_LANGUAGE_ID)
    const [stdin, setStdin] = useState("")
    const [result, setResult] = useState<SubmissionResult | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Set up SSE connection
    const { connectionState } = useSse("/api/judge0/stream", {
        events: ["submission"],
        parseJson: true,
        onMessage: (data) => {
            try {
                const parsed = SseMessageSchema.parse(data)
                if (parsed.submissionId && parsed.result) {
                    console.log(
                        "Received result for submission:",
                        parsed.submissionId
                    )
                    setResult(parsed.result)
                    setIsLoading(false)
                }
            } catch (err) {
                console.error("Error parsing SSE message:", err)
            }
        },
    })

    const isConnected = connectionState === "open"

    const handleRunCode = async () => {
        if (!isConnected) {
            setError("Not connected to execution server")
            return
        }

        setIsLoading(true)
        setError(null)
        setResult(null)

        try {
            const submission = await submitCode(code, languageId, stdin)
            console.log("Submission created:", submission.submissionId)
        } catch (err) {
            setIsLoading(false)
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("An unknown error occurred")
            }
        }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Code2 className="h-6 w-6" />
                            <h1 className="text-2xl font-bold">Online IDE</h1>
                        </div>
                        <ConnectionStatus isConnected={isConnected} />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
                    {/* Left Panel - Editor */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-between">
                            <LanguageSelector
                                value={languageId}
                                onChange={setLanguageId}
                            />
                            <Button
                                onClick={handleRunCode}
                                disabled={isLoading || !isConnected}
                                size="default"
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
                        <div className="flex-1 overflow-auto">
                            <CodeEditor
                                code={code}
                                stdin={stdin}
                                onCodeChange={setCode}
                                onStdinChange={setStdin}
                            />
                        </div>
                    </div>

                    {/* Right Panel - Output */}
                    <div className="h-full overflow-auto">
                        <CodeOutput
                            result={result}
                            isLoading={isLoading}
                            error={error}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}
