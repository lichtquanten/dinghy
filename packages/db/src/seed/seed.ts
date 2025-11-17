import {
    type Course,
    PrismaClient,
    type User,
} from "../generated/prisma/client.js"
import { assignments } from "./data/assignments.js"
import { courses } from "./data/courses.js"
import { enrollments } from "./data/enrollments.js"
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
        console.log(`✅ Seeded user: ${user.email}`)
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
        console.log(`✅ Seeded course: ${course.title}`)
    }

    return courseMap
}

async function seedAssignments(
    prisma: PrismaClient,
    courseMap: Map<string, Course>
) {
    for (const assignmentData of assignments) {
        const { courseTitle, testCases, ...rest } = assignmentData
        const course = courseMap.get(courseTitle)

        if (!course) {
            console.warn(
                `⚠️  Course "${courseTitle}" not found for assignment "${assignmentData.title}"`
            )
            continue
        }

        await prisma.assignment.upsert({
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
                testCases: { create: testCases },
            },
        })
        console.log(
            `✅ Seeded assignment: ${assignmentData.title} (${courseTitle})`
        )
    }
}

async function seedEnrollments(
    prisma: PrismaClient,
    userMap: Map<string, User>,
    courseMap: Map<string, Course>
) {
    for (const enrollmentData of enrollments) {
        const user = userMap.get(enrollmentData.userEmail)
        const course = courseMap.get(enrollmentData.courseTitle)

        if (!user || !course) {
            console.warn(
                `⚠️  Skipping enrollment: ${enrollmentData.userEmail} -> ${enrollmentData.courseTitle}`
            )
            continue
        }

        await prisma.enrollment.upsert({
            where: {
                userId_courseId: { userId: user.id, courseId: course.id },
            },
            update: {},
            create: { userId: user.id, courseId: course.id },
        })
        console.log(`✅ Seeded enrollment: ${user.email} -> ${course.title}`)
    }
}

async function seedDatabase() {
    const prisma = new PrismaClient()

    try {
        await prisma.$connect()
        console.log("✅ Database connected successfully\n")

        console.log("📝 Seeding users...")
        const userMap = await seedUsers(prisma)

        console.log("\n📚 Seeding courses...")
        const courseMap = await seedCourses(prisma)

        console.log("\n📋 Seeding assignments...")
        await seedAssignments(prisma, courseMap)

        console.log("\n👥 Seeding enrollments...")
        await seedEnrollments(prisma, userMap, courseMap)

        console.log("\n✅ Database seed completed successfully!")
    } catch (error) {
        console.error("❌ Database seed failed:", error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

await seedDatabase()
