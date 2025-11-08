import { Types } from "mongoose"
import { z } from "zod"

export const idSchema = z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ID format",
    })

export const idInput = z.object({
    id: idSchema,
})
