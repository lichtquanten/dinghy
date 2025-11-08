import mongoose from "mongoose"
import { z } from "zod"
import { getAssignmentModel } from "../models/assignment"
import { getCourseModel } from "../models/course"
import { assignments } from "../seed/assignments"
import { courses } from "../seed/courses"

const envSchema = z.object({
    MONGO_ROOT_URI: z.url(),
    MONGO_DB_NAME: z.string().min(1),
})

export const env = envSchema.parse(process.env)

async function syncCourses() {
    console.log("Syncing courses...\n")
    const CourseModel = getCourseModel()
    const courseIdMap = new Map<string, mongoose.Types.ObjectId>()

    for (const course of courses) {
        const doc = await CourseModel.findOneAndUpdate(
            { slug: course.slug },
            { $set: course, $setOnInsert: { createdAt: new Date() } },
            { upsert: true, new: true }
        )
        courseIdMap.set(course.slug, doc._id)
        console.log(`✓ ${course.slug} - ${course.title}`)
    }

    return courseIdMap
}

async function syncAssignments(
    courseIdMap: Map<string, mongoose.Types.ObjectId>
) {
    console.log(`\nSyncing ${assignments.length} assignments...\n`)
    const AssignmentModel = getAssignmentModel()

    for (const assignmentSeed of assignments) {
        const { courseSlug, ...rest } = assignmentSeed

        const courseId = courseIdMap.get(courseSlug)
        if (!courseId) {
            throw new Error(`Course not found: ${courseSlug}`)
        }

        await AssignmentModel.updateOne(
            { slug: rest.slug },
            {
                $set: { ...rest, courseId },
                $setOnInsert: { createdAt: new Date() },
            },
            { upsert: true }
        )
        console.log(`✓ ${rest.slug} - ${rest.title}`)
    }
}

async function main() {
    console.log("Syncing data to MongoDB...\n")

    await mongoose.connect(env.MONGO_ROOT_URI, { dbName: env.MONGO_DB_NAME })
    console.log("✓ Connected to MongoDB\n")

    const courseIdMap = await syncCourses()
    await syncAssignments(courseIdMap)

    console.log("\n✓ All data synced successfully")
    await mongoose.disconnect()
}

main().catch((err) => {
    console.error("Sync failed:", err)
    process.exit(1)
})
