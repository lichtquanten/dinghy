import { z } from "zod"

export const SubmissionMetadataSchema = z.object({
    userId: z.string(),
    timestamp: z.number(),
    signature: z.string(),
    used: z.boolean(),
})

export const Judge0ResultSchema = z.object({
    submissionId: z.string(),
    result: z.unknown(),
})

export type SubmissionMetadata = z.infer<typeof SubmissionMetadataSchema>
export type Judge0Result = z.infer<typeof Judge0ResultSchema>
