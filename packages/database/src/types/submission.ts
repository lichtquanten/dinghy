export const SUBMISSION_STATUSES = [
    "pending",
    "running",
    "passed",
    "failed",
    "error",
] as const

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number]

export interface TestResult {
    testCaseIndex: number
    passed: boolean
    actual_output?: string
    error?: string
}
