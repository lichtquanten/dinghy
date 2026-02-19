import { Button } from "@workspace/ui/components/button.js"
import { useExecutableCode } from "../../hooks/useExecutableCode"
import { useTestRunner } from "../../hooks/useTestRunner"
import type { TestCase } from "../../types"

interface TaskTestCasesProps {
    testCases: TestCase[]
}

export function TestCases({ testCases }: TaskTestCasesProps) {
    const getCode = useExecutableCode()
    const { runTests, results, isRunning, error } = useTestRunner()

    const code = getCode()
    const canRun = code !== null && !isRunning

    return (
        <div className="space-y-4">
            {/* Test case list */}
            <div className="space-y-3">
                {testCases.map((testCase, index) => {
                    // Find the result for this test case if tests have been run
                    const result = results.find(
                        (r) => r.testCaseId === testCase.id
                    )

                    return (
                        <div key={testCase.id} className="text-sm">
                            <div className="flex items-center gap-2 font-medium mb-1">
                                {/* Show pass/fail indicator if we have results */}
                                {result && (
                                    <span
                                        className={
                                            result.passed
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }
                                    >
                                        {result.passed ? "✓" : "✗"}
                                    </span>
                                )}
                                <span>
                                    {index + 1}. {testCase.description}
                                </span>
                            </div>

                            {testCase.input && (
                                <div className="text-muted-foreground text-xs">
                                    Input:{" "}
                                    <code className="bg-muted px-1 py-0.5 rounded">
                                        {testCase.input}
                                    </code>
                                </div>
                            )}

                            {testCase.expectedOutput && (
                                <div className="text-muted-foreground text-xs">
                                    Expected:{" "}
                                    <code className="bg-muted px-1 py-0.5 rounded">
                                        {testCase.expectedOutput}
                                    </code>
                                </div>
                            )}

                            {/* Show actual output if test failed */}
                            {result && !result.passed && (
                                <div className="text-red-600 text-xs mt-1">
                                    Got:{" "}
                                    <code className="bg-red-50 px-1 py-0.5 rounded">
                                        {result.actual || "(empty)"}
                                    </code>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Error display */}
            {error && (
                <div className="text-red-600 text-xs">
                    Error: {error.message}
                </div>
            )}

            {/* Run button */}
            <Button
                onClick={() => {
                    const code = getCode()
                    if (code !== null) {
                        void runTests(code)
                    }
                }}
                disabled={!canRun}
                variant="outline"
                size="sm"
                className="w-full"
            >
                {isRunning
                    ? "Running tests..."
                    : code === null
                      ? "Tests unavailable in review mode"
                      : "Run Tests"}
            </Button>
        </div>
    )
}
