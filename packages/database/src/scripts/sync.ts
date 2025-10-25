import mongoose from "mongoose"
import { z } from "zod"
import { getAssignmentModel } from "../models/assignment"
import { assignments } from "../seed/index"

const envSchema = z.object({
    MONGO_ROOT_URI: z.url(),
    MONGO_DB_NAME: z.string().min(1),
})

export const env = envSchema.parse(process.env)

async function main() {
    console.log("Syncing assignments to MongoDB...\n")

    await mongoose.connect(env.MONGO_ROOT_URI, { dbName: env.MONGO_DB_NAME })
    console.log("✓ Connected to MongoDB\n")

    console.log(`Found ${assignments.length} assignments to sync\n`)

    const assignmentModel = getAssignmentModel()

    for (const assignment of assignments) {
        await assignmentModel.updateOne(
            { slug: assignment.slug },
            {
                $set: assignment,
                $setOnInsert: { createdAt: new Date() },
            },
            { upsert: true }
        )
        console.log(`${assignment.slug} - ${assignment.title}`)
    }

    console.log("All assignments synced successfully")
    await mongoose.disconnect()
}

main().catch((err) => {
    console.error("Sync failed:", err)
    process.exit(1)
})
