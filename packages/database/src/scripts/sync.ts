import mongoose from "mongoose"
import { getAssignmentModel } from "../models/assignment"
import { assignments } from "../seed/index"
import { z } from "zod"

const envSchema = z.object({
    MONGODB_URI: z.url(),
    MONGODB_DB_NAME: z.string().min(1),
})

export const env = envSchema.parse(process.env)

async function main() {
    console.log("Syncing assignments to MongoDB...\n")

    await mongoose.connect(env.MONGODB_URI, { dbName: env.MONGODB_DB_NAME })
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
