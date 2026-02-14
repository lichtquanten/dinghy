import {
    type Assignment,
    type Course,
    PrismaClient,
    type User,
} from "@workspace/db/client"
import { assignments } from "./data/assignments.js"
import { courses } from "./data/courses.js"
import { memberships } from "./data/memberships.js"
import { pairings } from "./data/pairings.js"
import { users } from "./data/users.js"

async function seedUsers(prisma: PrismaClient) {
    const userMap = new Map<string, User>()

    for (const userData of users) {
        const { email, ...rest } = userData
        const user = await prisma.user.upsert({
            where: { email },
            update: rest,
            create: userData,
        })
        userMap.set(user.email, user)
        console.log(`Seeded user: ${user.email}`)
    }

    return userMap
}

async function seedCourses(prisma: PrismaClient) {
    const courseMap = new Map<string, Course>()

    for (const courseData of courses) {
        const course = await prisma.course.upsert({
            where: { title: courseData.title },
            update: courseData,
            create: courseData,
        })
        courseMap.set(course.title, course)
        console.log(`Seeded course: ${course.title}`)
    }

    return courseMap
}

async function seedAssignments(
    prisma: PrismaClient,
    courseMap: Map<string, Course>
) {
    const assignmentMap = new Map<string, Assignment>()

    for (const assignmentData of assignments) {
        const { courseTitle, tasks, ...rest } = assignmentData
        const course = courseMap.get(courseTitle)

        if (!course) {
            console.warn(
                `Course "${courseTitle}" not found for assignment "${assignmentData.title}"`
            )
            continue
        }

        const assignment = await prisma.assignment.upsert({
            where: {
                title_courseId: {
                    title: assignmentData.title,
                    courseId: course.id,
                },
            },
            update: rest,
            create: {
                courseId: course.id,
                ...rest,
                tasks: {
                    create: tasks.map(({ testCases, phases, ...taskRest }) => ({
                        ...taskRest,
                        testCases: { create: testCases },
                        ...(phases && phases.length > 0
                            ? { phases: { create: phases } }
                            : {}),
                    })),
                },
            },
        })
        assignmentMap.set(`${courseTitle}:${assignment.title}`, assignment)
        console.log(
            `Seeded assignment: ${assignmentData.title} (${courseTitle}) with ${tasks.length} tasks`
        )
    }

    return assignmentMap
}

async function seedMemberships(
    prisma: PrismaClient,
    userMap: Map<string, User>,
    courseMap: Map<string, Course>
) {
    for (const membershipData of memberships) {
        const user = userMap.get(membershipData.userEmail)
        const course = courseMap.get(membershipData.courseTitle)

        if (!user || !course) {
            console.warn(
                `Skipping membership: ${membershipData.userEmail} -> ${membershipData.courseTitle}`
            )
            continue
        }

        await prisma.courseMembership.upsert({
            where: {
                userId_courseId: { userId: user.id, courseId: course.id },
            },
            update: { role: membershipData.role },
            create: {
                userId: user.id,
                courseId: course.id,
                role: membershipData.role,
            },
        })
        console.log(
            `Seeded membership: ${user.email} -> ${course.title} (${membershipData.role})`
        )
    }
}

async function seedPairings(
    prisma: PrismaClient,
    userMap: Map<string, User>,
    assignmentMap: Map<string, Assignment>
) {
    for (const pairingData of pairings) {
        const assignmentKey = `${pairingData.courseTitle}:${pairingData.assignmentTitle}`
        const assignment = assignmentMap.get(assignmentKey)
        const partners = pairingData.partnerEmails
            .map((email) => userMap.get(email))
            .filter((u): u is User => u !== undefined)

        if (
            !assignment ||
            partners.length !== pairingData.partnerEmails.length
        ) {
            console.warn(
                `Skipping pairing for assignment "${pairingData.assignmentTitle}" - missing assignment or users`
            )
            continue
        }

        const partnerIds = partners.map((p) => p.id)

        const pairing = await prisma.pairing.create({
            data: {
                assignmentId: assignment.id,
                partnerIds,
                isYjsInitialized: pairingData.isYjsInitialized ?? false,
            },
        })

        for (const partner of partners) {
            await prisma.user.update({
                where: { id: partner.id },
                data: {
                    pairingIds: { push: pairing.id },
                },
            })
        }

        console.log(
            `Seeded pairing: ${pairingData.assignmentTitle} (${partners.map((p) => p.email).join(", ")})`
        )
    }
}

async function seedDatabase() {
    const prisma = new PrismaClient()

    try {
        await prisma.$connect()
        console.log("Database connected successfully\n")

        console.log("Seeding users...")
        const userMap = await seedUsers(prisma)

        console.log("\nSeeding courses...")
        const courseMap = await seedCourses(prisma)

        console.log("\nSeeding assignments...")
        const assignmentMap = await seedAssignments(prisma, courseMap)

        console.log("\nSeeding memberships...")
        await seedMemberships(prisma, userMap, courseMap)

        console.log("\nSeeding pairings...")
        await seedPairings(prisma, userMap, assignmentMap)

        console.log("\nDatabase seed completed successfully!")
    } catch (error) {
        console.error("Database seed failed:", error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

await seedDatabase()
