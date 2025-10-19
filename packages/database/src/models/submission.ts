import { prop, getModelForClass } from "@typegoose/typegoose"
import type { IModelOptions } from "@typegoose/typegoose/lib/types"
import type { Types } from "mongoose"
import type { CodeLanguageKey } from "../types/assignment"
import type { SubmissionStatus } from "../types/submission"

export class Submission {
    createdAt?: Date | undefined
    updatedAt?: Date | undefined
    @prop({ required: true, ref: "User" })
    public userId!: Types.ObjectId

    @prop({ required: true })
    public assignmentSlug!: string

    @prop({ required: true })
    public code!: string

    @prop({ required: true })
    public codeLanguage!: CodeLanguageKey

    @prop({ default: "pending" })
    public status!: SubmissionStatus

    @prop()
    public testResults?: {
        passed: number
        failed: number
        total: number
        details: Array<{
            testCaseIndex: number
            passed: boolean
            actual_output?: string
            error?: string
        }>
    }

    @prop()
    public executionTimeMs?: number
}

export function getSubmissionModel(options?: IModelOptions) {
    const model = getModelForClass(Submission, options)
    return model
}
