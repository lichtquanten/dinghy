import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose"
import type { IModelOptions, Ref } from "@typegoose/typegoose/lib/types"
import { Types } from "mongoose"
import type {
    AssignmentPublic,
    AssignmentSeed,
    AssignmentStatus,
    CodeLanguageKey,
} from "../types/assignment"
import type { Course } from "./course"

@modelOptions({ schemaOptions: { timestamps: true, collection: "testCases" } })
export class TestCase {
    @prop({ required: true })
    public input!: string

    @prop({ required: true })
    public expectedOutput!: string

    @prop({ default: false })
    public hidden!: boolean

    @prop()
    public description?: string
}

@modelOptions({
    schemaOptions: { timestamps: true, collection: "assignments" },
})
export class Assignment {
    createdAt?: Date | undefined
    updatedAt?: Date | undefined

    @prop({ required: true, unique: true })
    public slug!: string

    @prop({ required: true, index: true, type: Types.ObjectId })
    public courseId!: Ref<Course>

    @prop({ required: true })
    public dueDate!: Date

    @prop({ required: true })
    public title!: string

    @prop({ required: true, type: String })
    public codeLanguage!: CodeLanguageKey

    @prop({ required: true })
    public instructions!: string

    @prop({ required: true })
    public filename!: string

    @prop({ default: "" })
    public starterCode!: string

    @prop({ type: () => [TestCase], required: true })
    public testCases!: TestCase[]

    @prop({ default: "published", type: String })
    public status!: AssignmentStatus

    @prop()
    public order?: number

    @prop()
    public estimatedMinutes?: number
}

export function getAssignmentModel(options?: IModelOptions) {
    const model = getModelForClass(Assignment, options)
    return model
}

export function defineAssignmentSeed(seed: AssignmentSeed) {
    return seed
}

export function toPublicAssignment(assignment: Assignment): AssignmentPublic {
    const publicTestCases = assignment.testCases
        .filter((testCase) => !testCase.hidden)
        .map(({ hidden: _hidden, ...rest }) => rest)

    return {
        ...assignment,
        testCases: publicTestCases,
    }
}
