import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose"
import type { IModelOptions } from "@typegoose/typegoose/lib/types"

@modelOptions({ schemaOptions: { timestamps: true, collection: "progress" } })
export class Progress {
    createdAt?: Date | undefined
    updatedAt?: Date | undefined

    @prop({ required: true })
    public userId!: string

    @prop({ required: true })
    public assignmentSlug!: string

    @prop({ required: true })
    public code!: string
}

export function getUserProgressModel(options?: IModelOptions) {
    const model = getModelForClass(Progress, options)
    return model
}

export function defineProgress(progress: Progress) {
    return progress
}
