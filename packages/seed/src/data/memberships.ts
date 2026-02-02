// data/memberships.ts
import { defineMembership } from "../types.js"

export const memberships = [
    // CSCI 101
    defineMembership({
        userEmail: "instructor@demo.com",
        courseTitle: "CSCI 101",
        role: "instructor",
    }),
    defineMembership({
        userEmail: "user@demo.com",
        courseTitle: "CSCI 101",
        role: "student",
    }),
    defineMembership({
        userEmail: "student2@demo.com",
        courseTitle: "CSCI 101",
        role: "student",
    }),
    defineMembership({
        userEmail: "student3@demo.com",
        courseTitle: "CSCI 101",
        role: "student",
    }),
    defineMembership({
        userEmail: "student4@demo.com",
        courseTitle: "CSCI 101",
        role: "student",
    }),
    // CSCI 201
    defineMembership({
        userEmail: "instructor@demo.com",
        courseTitle: "CSCI 201",
        role: "instructor",
    }),
    defineMembership({
        userEmail: "user@demo.com",
        courseTitle: "CSCI 201",
        role: "student",
    }),
    defineMembership({
        userEmail: "student2@demo.com",
        courseTitle: "CSCI 201",
        role: "student",
    }),
]
