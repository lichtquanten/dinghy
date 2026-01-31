import { useCallback, useEffect, useState } from "react"
import type { RouterOutputs } from "@workspace/api"
import { useCodeExecution } from "@/lib/judge0/hooks/useCodeExecution"
import type { StudioState, TaskMode } from "../types"
import { StudioContext, type StudioContextValue } from "./StudioContext"

interface StudioProviderProps {
    assignment: RouterOutputs["assignment"]["get"]
    children: React.ReactNode
}

export function StudioProvider({ assignment, children }: StudioProviderProps) {
    const { executeCode, isConnected } = useCodeExecution()

    const [state, setState] = useState<StudioState>({
        assignment,
        partner: assignment.pairing?.partner ?? null,
        currentTaskIndex: assignment.pairing?.currentTaskIndex ?? 0,
        currentMode: assignment.pairing ? "collaborative" : "solo",
        readyState: {
            myReady: false,
            partnerReady: false,
            firstReadyAt: null,
        },
    })

    const [myCode, setMyCode] = useState(assignment.starterCode)
    const [partnerCode] = useState("") // TODO: Load from real-time collaboration
    const [sharedCode, setSharedCode] = useState("")
    const [startTime] = useState(() => Date.now())
    const [timeElapsed, setTimeElapsed] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeElapsed(Math.floor((Date.now() - startTime) / 1000))
        }, 1000)
        return () => clearInterval(interval)
    }, [startTime])

    const currentTask = state.assignment.tasks[state.currentTaskIndex]
    const minTimeSecs = 120
    const timeoutSecs = 30

    const canClickReady =
        state.currentMode === "solo" ? timeElapsed >= minTimeSecs : true
    const timeUntilReady =
        state.currentMode === "solo" && timeElapsed < minTimeSecs
            ? minTimeSecs - timeElapsed
            : null

    // Calculate timeout remaining - update via useEffect to avoid impure calls during render
    const [timeoutRemaining, setTimeoutRemaining] = useState<number | null>(
        null
    )
    useEffect(() => {
        if (!state.readyState.firstReadyAt) {
            return
        }
        const updateTimeout = () => {
            const remaining = Math.max(
                0,
                timeoutSecs -
                    Math.floor(
                        (Date.now() - state.readyState.firstReadyAt!) / 1000
                    )
            )
            setTimeoutRemaining(remaining)
        }
        updateTimeout()
        const interval = setInterval(updateTimeout, 1000)
        return () => clearInterval(interval)
    }, [state.readyState.firstReadyAt, timeoutSecs])

    const clickReady = useCallback(() => {
        if (!canClickReady) return
        setState((prev) => {
            const newMyReady = !prev.readyState.myReady
            const firstReadyAt =
                !prev.readyState.firstReadyAt && newMyReady
                    ? Date.now()
                    : prev.readyState.firstReadyAt
            return {
                ...prev,
                readyState: {
                    ...prev.readyState,
                    myReady: newMyReady,
                    firstReadyAt,
                },
            }
        })
    }, [canClickReady])

    const clickSubmit = useCallback(() => {
        console.log("Submitting solution...")
    }, [])

    const runTests = useCallback(() => {
        void (async () => {
            if (!isConnected) {
                console.error("Not connected to execution server")
                return
            }

            if (!currentTask?.testCases || currentTask.testCases.length === 0) {
                console.log("No test cases to run")
                return
            }

            console.log(`Running ${currentTask.testCases.length} tests...`)

            for (const testCase of currentTask.testCases) {
                try {
                    const result = await executeCode(
                        myCode,
                        state.assignment.codeLanguage,
                        testCase.input
                    )

                    const actualOutput = result.stdout?.trim() || ""
                    const expectedOutput = testCase.expectedOutput.trim()
                    const passed = actualOutput === expectedOutput

                    console.log(`Test: ${testCase.description}`, {
                        passed,
                        expected: expectedOutput,
                        actual: actualOutput,
                    })
                } catch (err) {
                    console.error(`Test ${testCase.description} failed:`, err)
                }
            }
        })()
    }, [
        currentTask,
        myCode,
        state.assignment.codeLanguage,
        executeCode,
        isConnected,
    ])

    const setMode = useCallback((mode: TaskMode) => {
        setState((prev) => ({
            ...prev,
            currentMode: mode,
            readyState: {
                myReady: false,
                partnerReady: false,
                firstReadyAt: null,
            },
        }))
    }, [])

    const value: StudioContextValue = {
        ...state,
        currentTask,
        clickReady,
        clickSubmit,
        runTests,
        setMode,
        myCode,
        partnerCode,
        sharedCode,
        setMyCode,
        setSharedCode,
        canClickReady,
        timeUntilReady,
        timeoutRemaining,
    }

    return (
        <StudioContext.Provider value={value}>
            {children}
        </StudioContext.Provider>
    )
}
