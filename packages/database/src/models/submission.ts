import {
    getModelForClass,
    index,
    modelOptions,
    mongoose,
    prop,
} from "@typegoose/typegoose"
import type { IModelOptions } from "@typegoose/typegoose/lib/types"
import type { SubmissionStatus } from "../types/submission"

@modelOptions({
    schemaOptions: { timestamps: true, collection: "submissions" },
})
@index({ userId: 1, assignmentId: 1 }, { unique: true })
export class Submission {
    _id!: string
    createdAt?: Date | undefined
    updatedAt?: Date | undefined

    @prop({ required: true, type: String })
    public userId!: string

    @prop({ required: true, type: mongoose.Types.ObjectId })
    public assignmentId!: string

    @prop({ required: true })
    public code!: string

    @prop({ default: "pending", type: String })
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
