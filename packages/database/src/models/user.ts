import { getModelForClass, prop } from "@typegoose/typegoose"
import type { ReturnModelType } from "@typegoose/typegoose/lib/types.js"
import type { IModelOptions } from "@typegoose/typegoose/lib/types.js"
import type { UserStatus } from "../types/user"

export class User {
    @prop({ required: true, unique: true })
    public email!: string

    @prop({ required: true })
    public name!: string

    @prop()
    public courseId?: string

    @prop()
    public avatar_url?: string

    @prop({ default: "active" })
    public status!: UserStatus

    @prop({ default: Date.now })
    public last_login?: Date
}

export function getUserModel(
    options?: IModelOptions
): ReturnModelType<typeof User> {
    const model = getModelForClass(User, options)
    return model
}
