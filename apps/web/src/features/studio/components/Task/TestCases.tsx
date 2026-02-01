import { Button } from "@workspace/ui/components/button.js"
import { useTestRunner } from "../../hooks/useTestRunner"
import type { TestCase } from "../../types"

interface TaskTestCasesProps {
    testCases: TestCase[]
}

export function TestCases({ testCases }: TaskTestCasesProps) {
    const { runTests } = useTestRunner()

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                {testCases.map((testCase, index) => (
                    <div key={testCase.id} className="text-sm">
                        <div className="font-medium mb-1">
                            {index + 1}. {testCase.description}
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
                    </div>
                ))}
            </div>

            <Button
                onClick={runTests}
                variant="outline"
                size="sm"
                className="w-full"
            >
                Run Tests
            </Button>
        </div>
    )
}
