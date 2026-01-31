import { definePairing } from "../types.js"

export const pairings = [
    definePairing({
        assignmentTitle: "String Reversal",
        courseTitle: "CSCI 101",
        memberEmails: ["user@demo.com", "student2@demo.com"],
        isStarted: false,
        isCompleted: false,
        currentTaskIndex: 0,
    }),
    definePairing({
        assignmentTitle: "String Reversal",
        courseTitle: "CSCI 101",
        memberEmails: ["student3@demo.com", "student4@demo.com"],
        isStarted: true,
        isCompleted: false,
        currentTaskIndex: 1,
    }),
    definePairing({
        assignmentTitle: "FizzBuzz",
        courseTitle: "CSCI 101",
        memberEmails: ["user@demo.com", "student3@demo.com"],
        isStarted: true,
        isCompleted: true,
        currentTaskIndex: 1,
    }),
    definePairing({
        assignmentTitle: "Binary Search",
        courseTitle: "CSCI 201",
        memberEmails: ["user@demo.com", "student2@demo.com"],
        isStarted: false,
        isCompleted: false,
        currentTaskIndex: 0,
    }),
]
