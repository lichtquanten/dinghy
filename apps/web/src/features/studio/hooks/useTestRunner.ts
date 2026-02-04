export function useTestRunner() {
    return {
        runTests: () => alert("Run tests pressed"),
    }
}
// import { useSuspenseQuery } from "@tanstack/react-query"
// import { useCallback } from "react"
// import { useCodeExecution } from "@/lib/judge0/hooks/useCodeExecution"
// import { trpc } from "@/lib/trpc"
// import { useAssignmentId, useCurrentTask } from "./assignment"

// interface TestResult {
//     description: string
//     passed: boolean
//     expected: string
//     actual: string
// }

// export function useTestRunner() {
//     const { executeCode, isConnected } = useCodeExecution()
//     const assignmentId = useAssignmentId()
//     const { data: assignment } = useSuspenseQuery(
//         trpc.assignment.get.queryOptions({ id: assignmentId })
//     )
//     const currentTask = useCurrentTask()

//     const runTests = useCallback(
//         async (code: string): Promise<TestResult[]> => {
//             if (!isConnected) {
//                 throw new Error("Not connected to execution server")
//             }

//             if (!currentTask?.testCases || currentTask.testCases.length === 0) {
//                 throw new Error("No test cases to run")
//             }

//             const results: TestResult[] = []

//             for (const testCase of currentTask.testCases) {
//                 const result = await executeCode(
//                     code,
//                     assignment.codeLanguage,
//                     testCase.input
//                 )
//                 const actualOutput = result.stdout?.trim() || ""
//                 const expectedOutput = testCase.expectedOutput.trim()
//                 const passed = actualOutput === expectedOutput

//                 results.push({
//                     description: testCase.description,
//                     passed,
//                     expected: expectedOutput,
//                     actual: actualOutput,
//                 })
//             }

//             return results
//         },
//         [isConnected, currentTask, executeCode, assignment.codeLanguage]
//     )

//     return { runTests, isConnected }
// }
