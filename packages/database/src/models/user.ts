import { getModelForClass, prop } from "@typegoose/typegoose"
import type { IModelOptions } from "@typegoose/typegoose/lib/types.js"
import type { UserRole } from "../types/user"

export class User {
    @prop({ required: true })
    public _id!: string

    @prop({ required: true, unique: true })
    public email!: string

    @prop({ required: true, type: String })
    public role!: UserRole
}

export function getUserModel(options?: IModelOptions) {
    return getModelForClass(User, options)
}

export function defineUser(user: User) {
    return user
}
