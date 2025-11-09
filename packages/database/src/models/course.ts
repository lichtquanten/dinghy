import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose"
import type { IModelOptions } from "@typegoose/typegoose/lib/types"
import { customAlphabet } from "nanoid"

const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ")

@modelOptions({
    schemaOptions: { timestamps: true, collection: "courses" },
})
export class Course {
    _id!: string
    createdAt?: Date | undefined
    updatedAt?: Date | undefined

    @prop({ required: true, unique: true })
    public title!: string

    @prop({ required: true, unique: true, default: () => nanoid(6) })
    public joinCode!: string

    @prop({ type: String })
    public createdBy?: string
}

export function getCourseModel(options?: IModelOptions) {
    return getModelForClass(Course, options)
}

export function defineCourse(course: Omit<Course, "_id">) {
    return course
}

export function filterCourseForStudent(
    course: Course
): Omit<Course, "joinCode" | "createdBy"> {
    const { joinCode: _, createdBy: __, ...rest } = course
    return rest
}
