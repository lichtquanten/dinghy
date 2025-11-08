import type { Enrollment } from "../models/enrollment"

export interface EnrollmentSeed
    extends Omit<Enrollment, "_id" | "createdAt" | "courseId"> {
    courseTitle: string
}
