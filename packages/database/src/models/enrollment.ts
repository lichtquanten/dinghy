import {
    getModelForClass,
    index,
    modelOptions,
    mongoose,
    prop,
} from "@typegoose/typegoose"
import type { IModelOptions } from "@typegoose/typegoose/lib/types"
import type { EnrollmentSeed } from "../types/enrollment"

@index({ userId: 1, courseId: 1 }, { unique: true })
@index({ courseId: 1 })
@modelOptions({
    schemaOptions: { timestamps: true, collection: "enrollments" },
})
export class Enrollment {
    _id!: string
    createdAt!: Date

    @prop({ required: true, type: String })
    public userId!: string

    @prop({ required: true, type: mongoose.Types.ObjectId })
    public courseId!: string
}

export function getEnrollmentModel(options?: IModelOptions) {
    return getModelForClass(Enrollment, options)
}

export function defineEnrollmentSeed(seed: EnrollmentSeed) {
    return seed
}
