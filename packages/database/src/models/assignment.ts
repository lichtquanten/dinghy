import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose"
import type { IModelOptions } from "@typegoose/typegoose/lib/types"
import type {
    CodeLanguageKey,
    AssignmentStatus,
    AssignmentPublic,
} from "../types/assignment"

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

    @prop({ required: true })
    public title!: string

    @prop({ required: true })
    public codeLanguage!: CodeLanguageKey

    @prop({ required: true })
    public descriptionMarkdown!: string

    @prop({ default: "" })
    public starterCode!: string

    @prop({ type: () => [TestCase], required: true })
    public testCases!: TestCase[]

    @prop({ default: "published" })
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

export function defineAssignment(assignment: Assignment) {
    return assignment
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
