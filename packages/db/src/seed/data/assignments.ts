import { CodeLanguage } from "../../generated/prisma/client.js"
import { defineAssignment } from "../types.js"

export const assignments = [
    defineAssignment({
        courseTitle: "CSCI 101",
        title: "Reverse a String",
        dueDate: new Date("2026-01-01"),
        instructions: "Reverse a string",
        filename: "reverse-string.js",
        starterCode: "// Your code here",
        codeLanguage: CodeLanguage.javascript,
        testCases: [
            {
                input: "hello",
                expectedOutput: "olleh",
                description: "Simple input",
            },
        ],
    }),
    defineAssignment({
        courseTitle: "CSCI 101",
        title: "FizzBuzz",
        dueDate: new Date("2026-01-15"),
        instructions: "Implement FizzBuzz",
        filename: "fizzbuzz.js",
        starterCode: "// Your code here",
        codeLanguage: CodeLanguage.javascript,
        testCases: [
            {
                input: "15",
                expectedOutput: "FizzBuzz",
                description: "Divisible by 3 and 5",
            },
        ],
    }),
]
