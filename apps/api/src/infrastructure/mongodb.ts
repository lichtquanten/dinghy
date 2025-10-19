import mongoose from "mongoose"
import { getModelForClass } from "@typegoose/typegoose"

import { User } from "@workspace/database/models/user.js"
import { Assignment } from "@workspace/database/models/assignment.js"

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

export const UserModel = getModelForClass(User, {
    schemaOptions: { timestamps: true },
})

export const AssignmentModel = getModelForClass(Assignment, {
    schemaOptions: { timestamps: true },
})
