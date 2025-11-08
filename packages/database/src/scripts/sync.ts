import mongoose from "mongoose"
import { z } from "zod"
import { getAssignmentModel } from "../models/assignment"
import { getCourseModel } from "../models/course"
import { getEnrollmentModel } from "../models/enrollment"
import { getUserModel } from "../models/user"
import assignmentSeeds from "../seed/assignments"
import courses from "../seed/courses"
import enrollmentSeeds from "../seed/enrollments"
import users from "../seed/users"

const envSchema = z.object({
    MONGO_ROOT_URI: z.url(),
    MONGO_DB_NAME: z.string().min(1),
})

export const env = envSchema.parse(process.env)

async function syncUsers() {
    console.log(`Syncing ${users.length} users...\n`)
    const UserModel = getUserModel()
    for (const user of users) {
        await UserModel.replaceOne({ _id: user._id }, user)
    }
}

async function syncCourses() {
    console.log(`Syncing ${courses.length} courses...\n`)
    const CourseModel = getCourseModel()
    const courseIdMap = new Map<string, string>()

    for (const course of courses) {
        const doc = await CourseModel.findOneAndReplace(
            { title: course.title },
            course
        )
        courseIdMap.set(course.title, doc!._id)
        console.log(`✓ ${course.title}`)
    }

    return courseIdMap
}

async function syncEnrollment(courseIdMap: Map<string, string>) {
    console.log(`Syncing ${enrollmentSeeds.length} enrollments...\n`)
    const EnrollmentModel = getEnrollmentModel()
    for (const enrollmentSeed of enrollmentSeeds) {
        const { courseTitle, ...rest } = enrollmentSeed
        const courseId = courseIdMap.get(courseTitle)
        if (!courseId) {
            throw new Error(`Course not found: ${courseTitle}`)
        }
        await EnrollmentModel.replaceOne({ courseId }, { courseId, ...rest })
    }
}

async function syncAssignments(courseIdMap: Map<string, string>) {
    console.log(`\nSyncing ${assignmentSeeds.length} assignments...\n`)
    const AssignmentModel = getAssignmentModel()

    for (const assignmentSeed of assignmentSeeds) {
        const { courseTitle, ...rest } = assignmentSeed

        const courseId = courseIdMap.get(courseTitle)
        if (!courseId) {
            throw new Error(`Course not found: ${courseTitle}`)
        }

        await AssignmentModel.replaceOne(
            { courseId, title: rest.title },
            { courseId, ...rest }
        )
        console.log(`✓ ${rest.title}`)
    }
}

async function main() {
    console.log("Syncing data to MongoDB...\n")

    await mongoose.connect(env.MONGO_ROOT_URI, { dbName: env.MONGO_DB_NAME })
    console.log("✓ Connected to MongoDB\n")

    await syncUsers()
    const courseIdMap = await syncCourses()
    await syncEnrollment(courseIdMap)
    await syncAssignments(courseIdMap)

    console.log("\n✓ All data synced successfully")
    await mongoose.disconnect()
}

main().catch((err) => {
    console.error("Sync failed:", err)
    process.exit(1)
})
