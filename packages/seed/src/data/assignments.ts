import { CodeLanguage, InteractionMode } from "@workspace/db/client"
import { defineAssignment } from "../types.js"

export const assignments = [
    defineAssignment({
        courseTitle: "CSCI 101",
        title: "String Reversal",
        description:
            "Learn to manipulate strings by implementing a string reversal function",
        dueDate: new Date("2026-02-15"),
        starterCode:
            'def reverse_string(s):\n    # Your code here\n    pass\n\nif __name__ == "__main__":\n    input_str = input()\n    print(reverse_string(input_str))',
        codeLanguage: CodeLanguage.python,
        tasks: [
            {
                order: 0,
                title: "Implement String Reversal",
                instructions:
                    "Write a function that takes a string as input and returns the reversed string.",
                phases: [
                    {
                        order: 0,
                        interactionMode: InteractionMode.solo,
                        maxTimeSecs: 300,
                    },
                    {
                        order: 1,
                        interactionMode: InteractionMode.collaborative,
                        maxTimeSecs: 300,
                    },
                ],
                testCases: [
                    {
                        input: "hello",
                        expectedOutput: "olleh",
                        description: "Simple lowercase string",
                    },
                    {
                        input: "Hello World",
                        expectedOutput: "dlroW olleH",
                        description: "String with spaces",
                    },
                ],
            },
            {
                order: 1,
                title: "Code Review",
                instructions:
                    "Review your partner's code. Check for edge cases and readability.",
                phases: [
                    {
                        order: 0,
                        interactionMode: InteractionMode.review,
                        maxTimeSecs: 300,
                    },
                ],
                testCases: [],
            },
        ],
    }),
    defineAssignment({
        courseTitle: "CSCI 101",
        title: "FizzBuzz",
        description: "Classic FizzBuzz problem",
        dueDate: new Date("2026-02-22"),
        starterCode: "function fizzBuzz(n) {\n  // Your code here\n}",
        codeLanguage: CodeLanguage.javascript,
        tasks: [
            {
                order: 0,
                title: "Implement FizzBuzz Logic",
                instructions:
                    "For numbers 1 to n: return 'Fizz' for multiples of 3, 'Buzz' for multiples of 5, 'FizzBuzz' for both, otherwise the number.",
                phases: [
                    {
                        order: 0,
                        interactionMode: InteractionMode.solo,
                        maxTimeSecs: 600,
                    },
                    {
                        order: 1,
                        interactionMode: InteractionMode.review,
                        maxTimeSecs: 300,
                    },
                ],
                testCases: [
                    {
                        input: "15",
                        expectedOutput:
                            '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]',
                        description: "Test with n=15",
                    },
                ],
            },
        ],
    }),
    defineAssignment({
        courseTitle: "CSCI 201",
        title: "Binary Search",
        description: "Implement binary search algorithm",
        dueDate: new Date("2026-03-15"),
        starterCode:
            "def binary_search(arr, target):\n    # Your code here\n    pass",
        codeLanguage: CodeLanguage.python,
        tasks: [
            {
                order: 0,
                title: "Implement Binary Search",
                instructions:
                    "Implement binary search to find a target value in a sorted array.",
                phases: [
                    {
                        order: 0,
                        interactionMode: InteractionMode.solo,
                        maxTimeSecs: 600,
                    },
                    {
                        order: 1,
                        interactionMode: InteractionMode.collaborative,
                        maxTimeSecs: 600,
                    },
                ],
                testCases: [
                    {
                        input: "[1,2,3,4,5], 3",
                        expectedOutput: "2",
                        description: "Find middle element",
                    },
                    {
                        input: "[1,2,3,4,5], 6",
                        expectedOutput: "-1",
                        description: "Element not found",
                    },
                ],
            },
            {
                order: 1,
                title: "Review and Test",
                instructions: "Review the implementation and test edge cases.",
                phases: [
                    {
                        order: 0,
                        interactionMode: InteractionMode.review,
                        maxTimeSecs: 600,
                    },
                ],
                testCases: [],
            },
        ],
    }),
    defineAssignment({
        courseTitle: "CSCI 201",
        title: "Linked List Reversal",
        description: "Implement a function to reverse a singly linked list",
        dueDate: new Date("2026-03-22"),
        starterCode:
            "class ListNode {\n    constructor(val) {\n        this.val = val;\n        this.next = null;\n    }\n}\n\nfunction reverseList(head) {\n    // Your code here\n}",
        codeLanguage: CodeLanguage.javascript,
        tasks: [
            {
                order: 0,
                title: "Understand Linked Lists",
                instructions:
                    "Review linked list structure and think about the reversal approach.",
                phases: [
                    {
                        order: 0,
                        interactionMode: InteractionMode.solo,
                        maxTimeSecs: 400,
                    },
                ],
                testCases: [],
            },
            {
                order: 1,
                title: "Implement Reversal",
                instructions:
                    "Implement the iterative approach to reverse a linked list.",
                phases: [
                    {
                        order: 0,
                        interactionMode: InteractionMode.solo,
                        maxTimeSecs: 500,
                    },
                    {
                        order: 1,
                        interactionMode: InteractionMode.collaborative,
                        maxTimeSecs: 500,
                    },
                ],
                testCases: [
                    {
                        input: "1->2->3->4->5",
                        expectedOutput: "5->4->3->2->1",
                        description: "Reverse a 5-node list",
                    },
                    {
                        input: "1->2",
                        expectedOutput: "2->1",
                        description: "Reverse a 2-node list",
                    },
                    {
                        input: "1",
                        expectedOutput: "1",
                        description: "Single node",
                    },
                ],
            },
            {
                order: 2,
                title: "Review and Discuss",
                instructions:
                    "Review the solution. Discuss space and time complexity.",
                phases: [
                    {
                        order: 0,
                        interactionMode: InteractionMode.review,
                        maxTimeSecs: 400,
                    },
                ],
                testCases: [],
            },
        ],
    }),
]
