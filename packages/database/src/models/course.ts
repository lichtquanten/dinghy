import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose"
import type { IModelOptions } from "@typegoose/typegoose/lib/types"

@modelOptions({
    schemaOptions: { timestamps: true, collection: "courses" },
})
export class Course {
    createdAt?: Date | undefined
    updatedAt?: Date | undefined

    @prop({ required: true, unique: true })
    public slug!: string

    @prop({ required: true })
    public title!: string
}

export function getCourseModel(options?: IModelOptions) {
    const model = getModelForClass(Course, options)
    return model
}

export function defineCourse(course: Course) {
    return course
}
