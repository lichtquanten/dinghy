import type { Prisma } from "../generated/prisma/client.js"

export type SeedUser = Prisma.UserCreateInput

export type SeedCourse = Prisma.CourseCreateInput

export type SeedTestCase = Omit<Prisma.TestCaseCreateInput, "task">

export type SeedTask = Omit<Prisma.TaskCreateInput, "assignment"> & {
    testCases: SeedTestCase[]
}

export type SeedAssignment = Omit<
    Prisma.AssignmentCreateInput,
    "course" | "tasks"
> & {
    courseTitle: string
    tasks: SeedTask[]
}

export type SeedEnrollment = Omit<
    Prisma.EnrollmentCreateInput,
    "user" | "course"
> & {
    userEmail: string
    courseTitle: string
}

export type SeedPairing = Omit<
    Prisma.PairingCreateInput,
    "assignment" | "members" | "session"
> & {
    assignmentTitle: string
    courseTitle: string
    memberEmails: string[]
}

export const defineUser = (user: SeedUser) => user
export const defineCourse = (course: SeedCourse) => course
export const defineAssignment = (assignment: SeedAssignment) => assignment
export const defineEnrollment = (enrollment: SeedEnrollment) => enrollment
export const definePairing = (pairing: SeedPairing) => pairing
