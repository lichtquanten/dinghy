import type { z } from "zod"
import type { Judge0ResultSchema, SubmissionMetadataSchema } from "./schema.ts"

export type SubmissionMetadata = z.infer<typeof SubmissionMetadataSchema>
export type Judge0Result = z.infer<typeof Judge0ResultSchema>
