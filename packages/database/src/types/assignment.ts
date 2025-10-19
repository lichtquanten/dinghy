import type { Assignment as AssignmentClass } from "../models/assignment"
import type { TestCase as TestCaseClass } from "../models/assignment"

export const CODE_LANGUAGES = [
    "python",
    "javascript",
    "typescript",
    "java",
    "cpp",
    "c",
    "rust",
    "go",
] as const

export type CodeLanguageKey = (typeof CODE_LANGUAGES)[number]

export const ASSIGNMENT_STATUSES = ["draft", "published", "archived"] as const

export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number]

export type TestCase = InstanceType<typeof TestCaseClass>

export type PublicTestCase = Omit<InstanceType<typeof TestCaseClass>, "hidden">

export type Assignment = InstanceType<typeof AssignmentClass>

export interface AssignmentPublic extends Omit<Assignment, "testCases"> {
    testCases: Array<PublicTestCase>
}
