import { useAtomValue } from "jotai"
import { useCodeExecution } from "@/lib/judge0/hooks/useCodeExecution"
import { assignmentAtom, currentTaskAtom, myCodeAtom } from "../atoms"

export function useTestRunner() {
    const { executeCode, isConnected } = useCodeExecution()
    const myCode = useAtomValue(myCodeAtom)
    const currentTask = useAtomValue(currentTaskAtom)
    const assignment = useAtomValue(assignmentAtom)

    const runTests = async () => {
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
                    assignment!.codeLanguage,
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
    }

    return { runTests, isConnected }
}
