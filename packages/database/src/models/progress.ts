import {
    getModelForClass,
    modelOptions,
    mongoose,
    prop,
} from "@typegoose/typegoose"
import type { IModelOptions } from "@typegoose/typegoose/lib/types"

@modelOptions({ schemaOptions: { timestamps: true, collection: "progress" } })
export class Progress {
    _id!: string
    createdAt?: Date | undefined
    updatedAt?: Date | undefined

    @prop({ required: true, type: String })
    public userId!: string

    @prop({ required: true, type: mongoose.Types.ObjectId })
    public assignmentId!: string

    @prop({ required: true })
    public code!: string
}

export function getUserProgressModel(options?: IModelOptions) {
    const model = getModelForClass(Progress, options)
    return model
}
