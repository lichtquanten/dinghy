import type { SubmissionStatus } from "@/types/judge0"

export const SUBMISSION_STATUSES = [
    { id: 1, description: "In Queue" },
    { id: 2, description: "Processing" },
    { id: 3, description: "Accepted" },
    { id: 4, description: "Wrong Answer" },
    { id: 5, description: "Time Limit Exceeded" },
    { id: 6, description: "Compilation Error" },
    { id: 7, description: "Runtime Error (SIGSEGV)" },
    { id: 8, description: "Runtime Error (SIGXFSZ)" },
    { id: 9, description: "Runtime Error (SIGFPE)" },
    { id: 10, description: "Runtime Error (SIGABRT)" },
    { id: 11, description: "Runtime Error (NZEC)" },
    { id: 12, description: "Runtime Error (Other)" },
    { id: 13, description: "Internal Error" },
    { id: 14, description: "Exec Format Error" },
] as const

export const SUBMISSION_STATUS_BY_ID = Object.fromEntries(
    SUBMISSION_STATUSES.map((status) => [status.id, status])
) as Record<number, SubmissionStatus>

export const StatusId = {
    IN_QUEUE: 1,
    PROCESSING: 2,
    ACCEPTED: 3,
    WRONG_ANSWER: 4,
    TIME_LIMIT_EXCEEDED: 5,
    COMPILATION_ERROR: 6,
    RUNTIME_ERROR_SIGSEGV: 7,
    RUNTIME_ERROR_SIGXFSZ: 8,
    RUNTIME_ERROR_SIGFPE: 9,
    RUNTIME_ERROR_SIGABRT: 10,
    RUNTIME_ERROR_NZEC: 11,
    RUNTIME_ERROR_OTHER: 12,
    INTERNAL_ERROR: 13,
    EXEC_FORMAT_ERROR: 14,
} as const
