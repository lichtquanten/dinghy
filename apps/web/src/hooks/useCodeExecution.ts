// hooks/useCodeExecution.ts
import { useState, useRef, useEffect, useCallback } from "react"
import { useSse } from "./useSse"
import { submitCode } from "@/api/judge0"
import type { SubmissionResult } from "@/types/judge0"
import { SseMessageSchema } from "@/types/judge0"
import { env } from "@/config/env"

interface UseCodeExecutionOptions {
    onTimeout?: (submissionId: string) => void
}

export const useCodeExecution = (options?: UseCodeExecutionOptions) => {
    const [result, setResult] = useState<SubmissionResult | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const timeoutRef = useRef<number | null>(null)
    const currentSubmissionId = useRef<string | null>(null)

    const clearExecutionTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
    }, [])

    const { connectionState } = useSse("/api/judge0/stream", {
        events: ["submission"],
        parseJson: true,
        onMessage: (data) => {
            try {
                const message = SseMessageSchema.parse(data)

                // Only process if this is the submission we're waiting for
                if (
                    message.submissionId === currentSubmissionId.current &&
                    message.result
                ) {
                    clearExecutionTimeout()

                    const result = message.result
                    if (result.error) {
                        setError(result.error)
                    } else {
                        setResult(result)
                        setError(null)
                    }

                    setIsLoading(false)
                    currentSubmissionId.current = null
                }
            } catch (err) {
                console.error("Error parsing SSE message:", err)
            }
        },
    })

    const executeCode = useCallback(
        async (code: string, languageId: number, stdin: string) => {
            const isConnected = connectionState === "open"

            if (!isConnected) {
                setError("Not connected to execution server")
                return
            }

            // Reset state
            clearExecutionTimeout()
            setIsLoading(true)
            setError(null)
            setResult(null)

            try {
                const submission = await submitCode(code, languageId, stdin)
                currentSubmissionId.current = submission.submissionId

                timeoutRef.current = setTimeout(() => {
                    if (
                        currentSubmissionId.current === submission.submissionId
                    ) {
                        setError(
                            "Code execution timed out. The server might be busy or your code might be taking too long to execute."
                        )
                        setIsLoading(false)
                        currentSubmissionId.current = null
                        options?.onTimeout?.(submission.submissionId)
                    }
                }, env.VITE_MAX_EXECUTION_WAIT_TIME * 1000)
            } catch (err) {
                clearExecutionTimeout()
                setIsLoading(false)
                currentSubmissionId.current = null

                if (err instanceof Error) {
                    setError(err.message)
                } else {
                    setError("An unknown error occurred")
                }
            }
        },
        [connectionState, clearExecutionTimeout, options]
    )

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearExecutionTimeout()
        }
    }, [clearExecutionTimeout])

    return {
        executeCode,
        result,
        isLoading,
        error,
        isConnected: connectionState === "open",
        clearError: () => setError(null),
    }
}
