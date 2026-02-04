import { defineCourse } from "../types.js"
import type { SeedCourse } from "../types.js"

export const courses: SeedCourse[] = [
    defineCourse({
        title: "CSCI 101",
        joinCode: "ABC123",
    }),
    defineCourse({
        title: "CSCI 201",
        joinCode: "DEF456",
    }),
]
