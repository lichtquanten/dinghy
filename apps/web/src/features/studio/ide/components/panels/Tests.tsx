// components/panels/Tests.tsx
import { useState } from "react"
import type { PublicTestCase } from "@workspace/database"
import { useAssignment } from "@/features/studio/context"
import { useRunTest } from "../../hooks/useRunTest"
import type { TestResult } from "../../hooks/useRunTest"

interface TestsProps {
    code: string
}

interface TestCaseItemProps {
    testCase: PublicTestCase
    result: TestResult | null
    index: number
}

function TestCaseItem({ testCase, result, index }: TestCaseItemProps) {
    const hasRun = result !== null
    const passed = result?.passed ?? false

    return (
        <div className="flex items-start gap-2.5 p-3 hover:bg-slate-50 rounded-md transition-colors">
            <div
                className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                    passed
                        ? "bg-emerald-500 border-emerald-500"
                        : hasRun
                          ? "bg-red-500 border-red-500"
                          : "border-border"
                }`}
            >
                {passed && (
                    <svg
                        className="w-full h-full text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                )}
                {hasRun && !passed && (
                    <svg
                        className="w-full h-full text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground">
                    {testCase.description || `Test Case ${index + 1}`}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                    {hasRun
                        ? passed
                            ? "Passed"
                            : result?.error
                              ? `Failed: ${result.error}`
                              : "Failed"
                        : "Not run yet"}
                </p>
            </div>
        </div>
    )
}

export default function Tests({ code }: TestsProps) {
    const assignment = useAssignment()
    const { runTest, isRunning, isConnected } = useRunTest(
        assignment.codeLanguage
    )

    const [results, setResults] = useState<Map<number, TestResult>>(new Map())

    const runAllTests = async () => {
        if (!assignment.testCases?.length || !isConnected) return

        setResults(new Map())

        for (const [index, testCase] of assignment.testCases.entries()) {
            const result = await runTest(code, testCase)
            if (result) {
                setResults((prev) => new Map(prev).set(index, result))
            }
        }
    }

    const totalTests = assignment.testCases?.length ?? 0
    const testsRun = results.size
    const testsPassed = Array.from(results.values()).filter(
        (r) => r.passed
    ).length

    return (
        <div className="px-4 py-3 space-y-2 bg-white">
            <div className="flex items-center justify-between mb-2">
                <button
                    onClick={runAllTests}
                    disabled={isRunning || !isConnected}
                    className="text-xs px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isRunning ? "Running tests..." : "Run All Tests"}
                </button>

                {testsRun > 0 && (
                    <span className="text-xs text-muted-foreground">
                        {testsPassed}/{totalTests} passed
                    </span>
                )}
            </div>

            {totalTests === 0 && (
                <div className="text-xs text-muted-foreground text-center py-4">
                    No test cases available
                </div>
            )}

            {assignment.testCases?.map((testCase, index) => (
                <TestCaseItem
                    key={index}
                    testCase={testCase}
                    result={results.get(index) ?? null}
                    index={index}
                />
            ))}
        </div>
    )
}
