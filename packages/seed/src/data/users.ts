// data/users.ts
import { defineUser } from "../types.js"

export const users = [
    defineUser({
        clerkId: "user_395qPANcI65t9CWzNe08wvu3bPR",
        email: "instructor@demo.com",
        firstName: "Professor",
        lastName: "Smith",
        isAdmin: false,
    }),
    defineUser({
        clerkId: "user_33cHeqbSLHrXxbfBCuEqMkH2H2O",
        email: "user@demo.com",
        firstName: "Alice",
        lastName: "Smith",
        isAdmin: false,
    }),
    defineUser({
        clerkId: "user_395qZFGvYo5guCSiW5O5QkLKjP1",
        email: "student2@demo.com",
        firstName: "Bob",
        lastName: "Johnson",
        isAdmin: false,
    }),
    defineUser({
        clerkId: "user_395qcAvEzAYSEDGr8QCkjIbmXjM",
        email: "student3@demo.com",
        firstName: "Carol",
        lastName: "Williams",
        isAdmin: false,
    }),
    defineUser({
        clerkId: "user_395qezp6nIxPaTNpvKgVrQInPTt",
        email: "student4@demo.com",
        firstName: "David",
        lastName: "Brown",
        isAdmin: false,
    }),
    defineUser({
        clerkId: "user_395qjqL5Me3nmmLnfoPMha3cOCX",
        email: "admin@demo.com",
        firstName: "Super",
        lastName: "Powers",
        isAdmin: true,
    }),
]
