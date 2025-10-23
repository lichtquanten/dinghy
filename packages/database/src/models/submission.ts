import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose"
import type { IModelOptions } from "@typegoose/typegoose/lib/types"
import type { SubmissionStatus } from "../types/submission"

@modelOptions({
    schemaOptions: { timestamps: true, collection: "submissions" },
})
export class Submission {
    createdAt?: Date | undefined
    updatedAt?: Date | undefined

    @prop({ required: true })
    public userId!: string

    @prop({ required: true })
    public assignmentSlug!: string

    @prop({ required: true })
    public code!: string

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
}

export function getSubmissionModel(options?: IModelOptions) {
    const model = getModelForClass(Submission, options)
    return model
}
