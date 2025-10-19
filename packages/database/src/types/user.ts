import type { User as UserClass } from "../models/user.js"
export const USER_STATUSES = ["active", "suspended", "deleted"] as const

export type UserStatus = (typeof USER_STATUSES)[number]

export type User = InstanceType<typeof UserClass>

// Client-safe version (if you need to hide fields in the future)
export type UserPublic = Omit<User, never>
