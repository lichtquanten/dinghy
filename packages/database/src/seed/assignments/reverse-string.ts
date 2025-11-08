import { defineAssignmentSeed } from "../../models/assignment.js"

export default defineAssignmentSeed({
    courseTitle: "CSCI 1xx",
    dueDate: new Date("2026-01-02"),
    title: "Reverse a String",
    codeLanguage: "javascript",
    estimatedMinutes: 10,
    filename: "reverse-string.py",
    instructions: `
## Reverse a String

Write a function that reverses a string.

**Example:**
\`\`\`javascript
reverseString("hello")  // "olleh"
reverseString("world")  // "dlrow"
\`\`\`

**Requirements:**
- Do not use built-in reverse methods
- Handle empty strings
- Preserve spaces and special characters
  `,
    starterCode: `function reverseString(str) {
  // TODO: Implement string reversal
  return str;
}

// Test your function
console.log(reverseString("hello"));`,
    testCases: [
        {
            input: "hello",
            expectedOutput: "olleh",
            hidden: false,
            description: "Basic string reversal",
        },
        {
            input: "",
            expectedOutput: "",
            hidden: false,
            description: "Empty string",
        },
        {
            input: "a b c",
            expectedOutput: "c b a",
            hidden: true,
            description: "String with spaces",
        },
    ],
    status: "published",
})
