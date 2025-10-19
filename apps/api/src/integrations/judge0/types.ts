import type { z } from "zod"
import type { Judge0ResultSchema, SubmissionMetadataSchema } from "./schema.js"

export type SubmissionMetadata = z.infer<typeof SubmissionMetadataSchema>
export type Judge0Result = z.infer<typeof Judge0ResultSchema>
