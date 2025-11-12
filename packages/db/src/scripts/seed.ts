import { CodeLanguage } from "../generated/prisma/client.js"
import { PrismaClient } from "../generated/prisma/client.js"

const seed = {
    user: {
        id: "user_33cHeqbSLHrXxbfBCuEqMkH2H2O",
        email: "user@demo.com",
    },
    course: {
        title: "CSCI 1xx",
        joinCode: "ABCDEF",
    },
    assignment: {
        title: "Reverse a String",
        dueDate: new Date("2026-01-01"),
        instructions: "Reverse a string",
        filename: "reverse-string.js",
        starterCode: "// Your code here",
        codeLanguage: CodeLanguage.javascript,
        testCases: {
            create: [
                {
                    input: "hello",
                    expectedOutput: "olleh",
                    description: "Simple input",
                },
            ],
        },
    },
}

async function seedUser(prisma: PrismaClient) {
    const { id, ...rest } = seed.user
    return await prisma.user.upsert({
        where: { id },
        update: rest,
        create: seed.user,
    })
}

async function seedCourse(prisma: PrismaClient) {
    return await prisma.course.upsert({
        where: { title: seed.course.title },
        update: seed.course,
        create: seed.course,
    })
}

async function seedAssignment(prisma: PrismaClient, courseId: string) {
    return await prisma.assignment.upsert({
        where: {
            title_courseId: {
                title: seed.assignment.title,
                courseId: courseId,
            },
        },
        update: seed.assignment,
        create: { courseId, ...seed.assignment },
    })
}

async function seedEnrollment(
    prisma: PrismaClient,
    userId: string,
    courseId: string
) {
    await prisma.enrollment.upsert({
        where: {
            userId_courseId: { userId, courseId },
        },
        update: {},
        create: { userId, courseId },
    })
}

async function seedDatabase() {
    const prisma = new PrismaClient()
    try {
        await prisma.$connect()
        console.log("✅ Database connected successfully")

        const user = await seedUser(prisma)
        const course = await seedCourse(prisma)
        await seedAssignment(prisma, course.id)
        await seedEnrollment(prisma, user.id, course.id)

        console.log("✅ Database seed completed")
    } catch (error) {
        console.error("❌ Database seed failed:", error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

await seedDatabase()
