import { defineAssignmentSeed } from "../../models/assignment.js"

export default defineAssignmentSeed({
    slug: "fizzbuzz",
    courseSlug: "csci1xx",
    dueDate: new Date("2026-01-01"),
    title: "FizzBuzz Challenge",
    codeLanguage: "python",
    order: 1,
    estimatedMinutes: 15,
    filename: "fizzbuzz.py",
    instructions: `
## FizzBuzz Challenge

Write a program that prints the numbers from 1 to 100.

**Rules:**
- For multiples of 3, print "Fizz"
- For multiples of 5, print "Buzz"
- For multiples of both 3 and 5, print "FizzBuzz"
- Otherwise, print the number

**Example output:**
\`\`\`
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
...
\`\`\`
  `,
    starterCode: `# TODO: Implement FizzBuzz
for i in range(1, 101):
    pass`,
    testCases: [
        {
            input: "",
            expectedOutput: "1\n2\nFizz\n4\nBuzz",
            hidden: false,
            description: "First 5 lines are correct",
        },
        {
            input: "",
            expectedOutput: "FizzBuzz",
            hidden: true,
            description: "Contains FizzBuzz for multiples of 15",
        },
    ],
    status: "published",
})
