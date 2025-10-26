// hooks/useRunTest.ts
import { useCallback, useState } from "react"
import type { CodeLanguageKey } from "@workspace/code-languages"
import { useCodeExecution } from "@/lib/judge0/hooks/useCodeExecution"

interface TestInput {
    input: string
    expectedOutput: string
}

export interface TestResult {
    passed: boolean
    output: string | null
    error: string | null
    actualOutput?: string
}

export function useRunTest(language: CodeLanguageKey) {
    const codeExecution = useCodeExecution()
    const [isRunning, setIsRunning] = useState(false)

    const runTest = useCallback(
        async (code: string, test: TestInput): Promise<TestResult | null> => {
            if (!codeExecution.isConnected) {
                return {
                    passed: false,
                    output: null,
                    error: "Not connected to execution server",
                }
            }

            setIsRunning(true)
            try {
                const result = await codeExecution.executeCode(
                    code,
                    language,
                    test.input
                )

                const actualOutput = result.stdout?.trim() || ""
                const passed = actualOutput === test.expectedOutput.trim()

                return {
                    passed,
                    output: result.stdout || null,
                    error: result.stderr || null,
                    actualOutput,
                }
            } catch (err) {
                console.error(err)
                return {
                    passed: false,
                    output: null,
                    error: "Unknown error",
                }
            } finally {
                setIsRunning(false)
            }
        },
        [codeExecution, language]
    )
    return {
        runTest,
        isRunning,
        isConnected: codeExecution.isConnected,
    }
}
