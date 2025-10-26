import { env } from "@/config/env"
import type { SubmissionResult } from "./types"

interface PendingSubmission {
    submissionId: string
    resolve: (result: SubmissionResult) => void
    reject: (error: Error) => void
    timeoutId: number
}

export class SubmissionTracker {
    private pending: PendingSubmission | null = null

    waitForResult(
        submissionId: string,
        onTimeout?: (id: string) => void
    ): Promise<SubmissionResult> {
        this.cleanup()

        return new Promise<SubmissionResult>((resolve, reject) => {
            const timeoutId = window.setTimeout(() => {
                const error = new Error(
                    "Code execution timed out. The server might be busy or your code might be taking too long to execute."
                )
                reject(error)
                this.cleanup()
                onTimeout?.(submissionId)
            }, env.VITE_MAX_EXECUTION_WAIT_TIME * 1000)

            this.pending = { submissionId, resolve, reject, timeoutId }
        })
    }

    handleResult(submissionId: string, result: SubmissionResult): boolean {
        if (!this.pending || this.pending.submissionId !== submissionId) {
            return false
        }

        if (result.error) {
            this.pending.reject(new Error(result.error))
        } else {
            this.pending.resolve(result)
        }

        this.cleanup()
        return true
    }

    cleanup() {
        if (this.pending?.timeoutId) {
            clearTimeout(this.pending.timeoutId)
        }
        this.pending = null
    }

    abort(reason: string) {
        if (this.pending) {
            this.pending.reject(new Error(reason))
            this.cleanup()
        }
    }
}
