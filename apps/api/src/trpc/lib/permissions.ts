import { TRPCError } from "@trpc/server"
import type { MembershipRole, Prisma, PrismaClient } from "@workspace/db/client"

type Tx = PrismaClient | Prisma.TransactionClient

export async function requireCourseMembership(
    tx: Tx,
    userId: string,
    courseId: string,
    roles?: MembershipRole[]
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

    const membership = await tx.courseMembership.findUnique({
        where: { userId_courseId: { userId, courseId } },
    })

    if (!membership) {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: "You must be a member of this course",
        })
    }

    if (roles && !roles.includes(membership.role)) {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: `Requires ${roles.join(" or ")} role`,
        })
    }

    return membership
}

export async function requireInstructor(
    tx: Tx,
    userId: string,
    courseId: string
) {
    return requireCourseMembership(tx, userId, courseId, ["instructor"])
}

export async function requireStudent(tx: Tx, userId: string, courseId: string) {
    return requireCourseMembership(tx, userId, courseId, ["student"])
}

export async function requireAssignmentAccess(
    tx: Tx,
    userId: string,
    assignmentId: string,
    roles?: MembershipRole[]
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

    const membership = await requireCourseMembership(
        tx,
        userId,
        assignment.courseId,
        roles
    )

    return { courseId: assignment.courseId, membership }
}
