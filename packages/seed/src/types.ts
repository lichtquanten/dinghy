import type { MembershipRole, Prisma } from "@workspace/db/client"

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

export type SeedMembership = {
    userEmail: string
    courseTitle: string
    role: MembershipRole
}

export type SeedPairing = Omit<
    Prisma.PairingCreateInput,
    "assignment" | "partners" | "session"
> & {
    assignmentTitle: string
    courseTitle: string
    partnerEmails: string[]
}

export const defineUser = (user: SeedUser) => user
export const defineCourse = (course: SeedCourse) => course
export const defineAssignment = (assignment: SeedAssignment) => assignment
export const defineMembership = (membership: SeedMembership) => membership
export const definePairing = (pairing: SeedPairing) => pairing
