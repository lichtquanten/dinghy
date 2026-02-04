import { skipToken } from "@tanstack/react-query"
import { useSubscription } from "@trpc/tanstack-react-query"
import { useCallback, useEffect, useRef, useState } from "react"
import { type RouterOutputs } from "@workspace/api"
import type { CodeLanguage } from "@workspace/db/client"
import { trpc } from "@/lib/trpc"

type ExecutionResultIterable = RouterOutputs["execution"]["run"]
type ExecutionResult =
    ExecutionResultIterable extends AsyncIterable<infer T> ? T : never

interface RunInput {
    code: string
    language: CodeLanguage
    stdin?: string
}

interface PendingExecution {
    input: RunInput
    resolve: (result: ExecutionResult) => void
    reject: (error: unknown) => void
}

export function useCodeExecution() {
    const [pendingExecution, setPendingExecution] =
        useState<PendingExecution | null>(null)
    const pendingExecutionRef = useRef<PendingExecution | null>(null)

    useEffect(() => {
        pendingExecutionRef.current = pendingExecution
    }, [pendingExecution])

    const handleData = useCallback((data: ExecutionResult) => {
        setPendingExecution((current) => {
            current?.resolve(data)
            return null
        })
    }, [])

    const handleError = useCallback((error: unknown) => {
        setPendingExecution((current) => {
            current?.reject(error)
            return null
        })
    }, [])

    useSubscription(
        trpc.execution.run.subscriptionOptions(
            pendingExecution?.input ?? skipToken,
            {
                enabled: pendingExecution?.input !== undefined,
                onData: handleData,
                onError: handleError,
            }
        )
    )

    const run = useCallback((input: RunInput): Promise<ExecutionResult> => {
        if (pendingExecutionRef.current) {
            return Promise.reject(new Error("Execution already in progress"))
        }
        return new Promise((resolve, reject) => {
            setPendingExecution({ input, resolve, reject })
        })
    }, [])

    return { run, isRunning: Boolean(pendingExecution) }
}
