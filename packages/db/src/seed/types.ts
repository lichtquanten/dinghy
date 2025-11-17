import type { Prisma } from "../generated/prisma/client.js"

export type SeedUser = Prisma.UserCreateInput

export type SeedCourse = Prisma.CourseCreateInput

export type SeedAssignment = Omit<
    Prisma.AssignmentCreateInput,
    "course" | "testCases" | "submissions"
> & {
    courseTitle: string
    testCases: Array<Omit<Prisma.TestCaseCreateInput, "assignment">>
}

export type SeedEnrollment = {
    userEmail: string
    courseTitle: string
}

export const defineUser = (user: SeedUser) => user
export const defineCourse = (course: SeedCourse) => course
export const defineAssignment = (assignment: SeedAssignment) => assignment
export const defineEnrollment = (enrollment: SeedEnrollment) => enrollment
