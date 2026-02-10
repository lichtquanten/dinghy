import { skipToken } from "@tanstack/react-query"
import { useSubscription } from "@trpc/tanstack-react-query"
import { useCallback, useRef, useState } from "react"
import { trpc } from "@/lib/trpc"
import { useAssignmentId } from "./assignment"
import { useCurrentTask } from "./progress"

export interface TestResult {
    testCaseId: string
    description: string
    passed: boolean
    expected: string
    actual: string
}

interface TestRunnerState {
    results: TestResult[]
    expectedCount: number
    error: Error | null
}

export function useTestRunner() {
    const [state, setState] = useState<TestRunnerState>({
        results: [],
        expectedCount: 0,
        error: null,
    })

    const currentTask = useCurrentTask()
    const assignmentId = useAssignmentId()

    const [runInput, setRunInput] = useState<{
        assignmentId: string
        taskIndex: number
        code: string
    } | null>(null)

    // Reset on task change without useEffect
    const taskIdRef = useRef(currentTask?.id)
    if (taskIdRef.current !== currentTask?.id) {
        taskIdRef.current = currentTask?.id
        setState({ results: [], expectedCount: 0, error: null })
        setRunInput(null)
    }

    // Derive isRunning from state — no effect needed for completion detection
    const isRunning =
        runInput !== null &&
        state.expectedCount > 0 &&
        state.results.length < state.expectedCount

    useSubscription(
        trpc.execution.runTests.subscriptionOptions(runInput ?? skipToken, {
            enabled: runInput !== null,
            onData: (data) => {
                const testCase = currentTask?.testCases[data.index]
                if (!testCase) return

                setState((prev) => ({
                    ...prev,
                    results: [
                        ...prev.results,
                        {
                            testCaseId: testCase.id,
                            description: testCase.description,
                            passed: data.passed,
                            expected: testCase.expectedOutput.trim(),
                            actual: data.result.stdout?.trim() ?? "",
                        },
                    ],
                }))
            },
            onError: (err) => {
                setState((prev) => ({
                    ...prev,
                    expectedCount: 0,
                    error: new Error(err.message),
                }))
                setRunInput(null)
            },
        })
    )

    // Clean up runInput when all results are in
    if (
        runInput !== null &&
        state.expectedCount > 0 &&
        state.results.length >= state.expectedCount
    ) {
        setRunInput(null)
    }

    const runTests = useCallback(
        (code: string) => {
            if (!currentTask?.testCases) return
            setState({
                results: [],
                expectedCount: currentTask.testCases.length,
                error: null,
            })
            setRunInput({
                assignmentId,
                taskIndex: currentTask.order,
                code,
            })
        },
        [assignmentId, currentTask]
    )

    const reset = useCallback(() => {
        setState({ results: [], expectedCount: 0, error: null })
        setRunInput(null)
    }, [])

    return {
        runTests,
        results: state.results,
        isRunning,
        error: state.error,
        reset,
    }
}
