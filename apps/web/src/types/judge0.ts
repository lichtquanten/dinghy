import { z } from "zod"
import { Base64 } from "js-base64"
import type { SUBMISSION_STATUSES } from "@/config/consts/judge0"

const b64text = z.string().transform((s) => Base64.decode(s))

export interface SubmissionRequest {
    source_code: string
    language_id: number
    stdin?: string
}
export const SubmissionAckSchema = z.object({
    token: z.string(),
    submissionId: z.string(),
})
export type SubmissionAck = z.infer<typeof SubmissionAckSchema>

export const StatusSchema = z.object({
    id: z.number(),
    description: z.string(),
})
export type Status = z.infer<typeof StatusSchema>

export const SubmissionResultSchema = z.object({
    stdout: b64text.optional().nullable(),
    stderr: b64text.optional().nullable(),
    compile_output: b64text.optional().nullable(),
    status: StatusSchema.optional(),
    error: z.string().optional(),
})
export type SubmissionResult = z.infer<typeof SubmissionResultSchema>

export const SseMessageSchema = z.object({
    submissionId: z.string().optional(),
    result: SubmissionResultSchema.optional(),
})
export type SseMessage = z.infer<typeof SseMessageSchema>

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number]
