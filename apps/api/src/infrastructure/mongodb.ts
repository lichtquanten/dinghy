import { getModelForClass } from "@typegoose/typegoose"
import mongoose from "mongoose"
import { Assignment } from "@workspace/database/models/assignment.js"
import { Progress } from "@workspace/database/models/progress.js"
import { User } from "@workspace/database/models/user.js"
import { env } from "../config/env.js"

export async function connectMongoDB() {
    await mongoose.connect(env.MONGO_API_URI, {
        dbName: env.MONGO_DB_NAME,
    })

    console.log("MongoDB connected")
}

export async function disconnectMongoDB() {
    await mongoose.disconnect()
    console.log("MongoDB disconnected")
}

export const UserModel = getModelForClass(User)

export const AssignmentModel = getModelForClass(Assignment)

export const ProgressModel = getModelForClass(Progress)
