import { TRPCError } from "@trpc/server"
import type { Prisma, PrismaClient } from "@workspace/db/client"

type Tx = PrismaClient | Prisma.TransactionClient

export async function requireCourseEnrollment(
    tx: Tx,
    userId: string,
    courseId: string
) {
    if (!courseId) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Missing courseId",
        })
    }

    const course = await tx.course.findUnique({
        where: { id: courseId },
        select: { id: true },
    })

    if (!course) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Course not found",
        })
    }

    const enrollment = await tx.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
    })

    if (!enrollment) {
        throw new TRPCError({
            code: "FORBIDDEN",
            message:
                "You must be enrolled in this course to access this resource",
        })
    }

    return enrollment
}

export async function requireAssignmentAccess(
    tx: Tx,
    userId: string,
    assignmentId: string
) {
    const assignment = await tx.assignment.findUnique({
        where: { id: assignmentId },
        select: { courseId: true },
    })

    if (!assignment) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Assignment not found",
        })
    }

    const enrollment = await requireCourseEnrollment(
        tx,
        userId,
        assignment.courseId
    )

    return { courseId: assignment.courseId, enrollment }
}
