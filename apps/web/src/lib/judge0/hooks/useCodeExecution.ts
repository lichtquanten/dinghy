// hooks/useCodeExecution.ts
import { useCallback, useEffect, useMemo, useState } from "react"
import { type CodeLanguageKey, getJudge0Id } from "@workspace/code-languages"
import { useSse } from "@/lib/hooks/useSse"
import { submitCode } from "../api"
import { SubmissionTracker } from "../submissionTracker"
import type { SubmissionResult } from "../types"
import { SseMessageSchema } from "../types"

interface UseCodeExecutionOptions {
    onTimeout?: (submissionId: string) => void
}

export const useCodeExecution = (options?: UseCodeExecutionOptions) => {
    const [result, setResult] = useState<SubmissionResult | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const submissions = useMemo(() => new SubmissionTracker(), [])

    const { connectionState } = useSse("/api/judge0/stream", {
        events: ["submission"],
        parseJson: true,
        onMessage: (data) => {
            try {
                const message = SseMessageSchema.parse(data)
                if (
                    message.result &&
                    submissions.handleResult(
                        message.submissionId,
                        message.result
                    )
                ) {
                    if (message.result.error) {
                        setError("Server error")
                    } else {
                        setResult(message.result)
                        setError(null)
                    }
                    setIsLoading(false)
                }
            } catch (err) {
                console.error("Error parsing SSE message:", err)
            }
        },
    })

    const executeCode = useCallback(
        async (
            code: string,
            language: CodeLanguageKey,
            stdin: string
        ): Promise<SubmissionResult> => {
            if (connectionState !== "open") {
                const error = new Error("Not connected to execution server")
                setError(error.message)
                throw error
            }

            setIsLoading(true)
            setError(null)
            setResult(null)

            try {
                const submission = await submitCode(
                    code,
                    getJudge0Id(language),
                    stdin
                )
                return await submissions.waitForResult(
                    submission.submissionId,
                    options?.onTimeout
                )
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "An unknown error occurred"
                setError(errorMessage)
                setIsLoading(false)
                throw err
            }
        },
        [connectionState, submissions, options]
    )

    useEffect(() => {
        return () => submissions.abort("Component unmounted")
    }, [submissions])

    return {
        executeCode,
        result,
        isLoading,
        error,
        isConnected: connectionState === "open",
        clearError: () => setError(null),
    }
}
