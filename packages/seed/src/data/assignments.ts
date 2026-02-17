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
    defineAssignment({
        courseTitle: "CSCI 201",
        title: "Spell Checker",
        description:
            "Build an interactive spell checker that checks words against a dictionary and suggests corrections for simple typos.",
        dueDate: new Date("2026-03-29"),
        starterCode: `# Spell Checker Starter Code
# Run: python spell.py

dictionary = [
    "house", "mouse", "horse",
    "cat", "cut", "cute", "cot", "coat",
    "spell", "spelling", "checker", "check",
    "hello", "world",
]

while True:
    user_input = input("Enter a word (or type 'quit' to exit): ")

    if user_input == "quit":
        print("Goodbye.")
        break

    word = user_input

    found = False
    for entry in dictionary:
        if entry == word:
            found = True

    if found:
        print("'" + word + "' is spelled correctly.")
    else:
        print("'" + word + "' not found.")

        suggestions = []
        for entry in dictionary:
            if entry[0] == word[0]:
                suggestions.append(entry)

        if suggestions:
            print("Did you mean: " + " ".join(suggestions))
`,
        codeLanguage: CodeLanguage.python,
        tasks: [
            {
                order: 0,
                title: "Refactor the Starter Code",
                instructions:
                    "Reorganize the starter code into well-named functions with clear responsibilities. Extract word lookup, suggestion generation, and the interactive loop into separate functions. Add a main() entry point. Do not change program behavior yet. Focus on readability, structure, and clean abstractions.",
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
                    {
                        order: 2,
                        interactionMode: InteractionMode.collaborative,
                        maxTimeSecs: 300,
                    },
                ],
                testCases: [],
            },
            {
                order: 1,
                title: "Make Lookup Correct and Fast",
                instructions:
                    "Fix lookup so it is case-insensitive and ignores leading/trailing whitespace. Replace the linear scan with a set for O(1) membership checks. The program should print whether the word is spelled correctly or not found.",
                phases: [
                    {
                        order: 0,
                        interactionMode: InteractionMode.solo,
                        maxTimeSecs: 500,
                    },
                    {
                        order: 1,
                        interactionMode: InteractionMode.review,
                        maxTimeSecs: 300,
                    },
                    {
                        order: 2,
                        interactionMode: InteractionMode.collaborative,
                        maxTimeSecs: 300,
                    },
                ],
                testCases: [
                    {
                        input: "house",
                        expectedOutput: "'house' is spelled correctly.",
                        description: "Exact match",
                    },
                    {
                        input: "House",
                        expectedOutput: "'house' is spelled correctly.",
                        description: "Case-insensitive match",
                    },
                    {
                        input: "  house  ",
                        expectedOutput: "'house' is spelled correctly.",
                        description: "Ignores leading/trailing whitespace",
                    },
                    {
                        input: "xyzzy",
                        expectedOutput: "'xyzzy' not found.",
                        description: "Word not in dictionary",
                    },
                ],
            },
            {
                order: 2,
                title: "Simple Typo Suggestions",
                instructions:
                    "Replace the current suggestion behavior with single-character substitution suggestions. When a word is not found, find all dictionary words of the same length that differ by exactly one character. Print them on the same line as: 'word' not found. Did you mean: ... If there are no suggestions, print only: 'word' not found.",
                phases: [
                    {
                        order: 0,
                        interactionMode: InteractionMode.solo,
                        maxTimeSecs: 700,
                    },
                    {
                        order: 1,
                        interactionMode: InteractionMode.review,
                        maxTimeSecs: 300,
                    },
                    {
                        order: 2,
                        interactionMode: InteractionMode.collaborative,
                        maxTimeSecs: 400,
                    },
                ],
                testCases: [
                    {
                        input: "houze",
                        expectedOutput:
                            "'houze' not found. Did you mean: house mouse",
                        description:
                            "Same length, exactly one character different",
                    },
                    {
                        input: "cet",
                        expectedOutput:
                            "'cet' not found. Did you mean: cat cut",
                        description: "Short word suggestions",
                    },
                    {
                        input: "zzzz",
                        expectedOutput: "'zzzz' not found.",
                        description: "No suggestions",
                    },
                ],
            },
            {
                order: 3,
                title: "Faster Suggestions with Buckets",
                instructions:
                    "Speed up suggestion generation by grouping dictionary words by length. Build a map from length -> list of words. When generating suggestions, only scan the list for that length. The output should match Task 2 exactly.",
                phases: [
                    {
                        order: 0,
                        interactionMode: InteractionMode.solo,
                        maxTimeSecs: 800,
                    },
                    {
                        order: 1,
                        interactionMode: InteractionMode.review,
                        maxTimeSecs: 400,
                    },
                    {
                        order: 2,
                        interactionMode: InteractionMode.collaborative,
                        maxTimeSecs: 500,
                    },
                ],
                testCases: [
                    {
                        input: "houze",
                        expectedOutput:
                            "'houze' not found. Did you mean: house mouse",
                        description: "Bucketed suggestions match Task 2",
                    },
                    {
                        input: "cet",
                        expectedOutput:
                            "'cet' not found. Did you mean: cat cut",
                        description: "Bucketed suggestions match Task 2",
                    },
                ],
            },
            {
                order: 4,
                title: "Rank Suggestions and Limit Output",
                instructions:
                    "Improve suggestion quality by ranking suggestions and limiting output to the top 5. You may use a simple similarity score (for example, count matching character positions) or implement edit distance. Keep using buckets from Task 3. If suggestions exist, print: 'word' not found. Did you mean: <up to 5 suggestions> Otherwise print only: 'word' not found.",
                phases: [
                    {
                        order: 0,
                        interactionMode: InteractionMode.solo,
                        maxTimeSecs: 900,
                    },
                    {
                        order: 1,
                        interactionMode: InteractionMode.review,
                        maxTimeSecs: 400,
                    },
                    {
                        order: 2,
                        interactionMode: InteractionMode.collaborative,
                        maxTimeSecs: 600,
                    },
                ],
                testCases: [
                    {
                        input: "houze",
                        expectedOutput:
                            "'houze' not found. Did you mean: house mouse horse",
                        description: "Ranked suggestions, best first",
                    },
                ],
            },
        ],
    }),
    defineAssignment({
        courseTitle: "CSCI 201",
        title: "Spell Checker",
        description:
            "Build an interactive spell checker that checks words against a dictionary and suggests corrections for simple typos.",
        dueDate: new Date("2026-03-29"),
        starterCode: `# Spell Checker Starter Code
# Run: python spell.py

dictionary = [
    "house", "mouse", "horse",
    "cat", "cut", "cute", "cot", "coat",
    "spell", "spelling", "checker", "check",
    "hello", "world",
]

while True:
    user_input = input("Enter a word (or type 'quit' to exit): ")

    if user_input == "quit":
        print("Goodbye.")
        break

    word = user_input

    found = False
    for entry in dictionary:
        if entry == word:
            found = True

    if found:
        print("'" + word + "' is spelled correctly.")
    else:
        print("'" + word + "' not found.")

        suggestions = []
        for entry in dictionary:
            if entry[0] == word[0]:
                suggestions.append(entry)

        if suggestions:
            print("Did you mean: " + " ".join(suggestions))
`,
        codeLanguage: CodeLanguage.python,
        tasks: [
            {
                order: 0,
                title: "Run It and Fix the Bugs",
                instructions:
                    "Run the starter program and try a variety of inputs. Fix any crashes and obvious incorrect behavior so the program can be used normally.",
                phases: [
                    {
                        order: 0,
                        interactionMode: InteractionMode.solo,
                        maxTimeSecs: 300,
                    },
                    {
                        order: 1,
                        interactionMode: InteractionMode.review,
                        maxTimeSecs: 300,
                    },
                    {
                        order: 2,
                        interactionMode: InteractionMode.collaborative,
                        maxTimeSecs: 300,
                    },
                ],
                testCases: [
                    {
                        input: "",
                        expectedOutput: "'' not found.",
                        description: "Does not crash on empty input",
                    },
                    {
                        input: "House",
                        expectedOutput: "'house' is spelled correctly.",
                        description: "Case-insensitive match",
                    },
                    {
                        input: "  house  ",
                        expectedOutput: "'house' is spelled correctly.",
                        description: "Ignores leading/trailing whitespace",
                    },
                    {
                        input: "xyzzy",
                        expectedOutput: "'xyzzy' not found.",
                        description: "Word not in dictionary",
                    },
                ],
            },
            {
                order: 1,
                title: "Refactor Into Functions",
                instructions:
                    "Reorganize your working program into well-named functions with clear responsibilities.",
                phases: [
                    {
                        order: 0,
                        interactionMode: InteractionMode.solo,
                        maxTimeSecs: 300,
                    },
                    {
                        order: 1,
                        interactionMode: InteractionMode.review,
                        maxTimeSecs: 300,
                    },
                    {
                        order: 2,
                        interactionMode: InteractionMode.collaborative,
                        maxTimeSecs: 300,
                    },
                ],
                testCases: [
                    {
                        input: "House",
                        expectedOutput: "'house' is spelled correctly.",
                        description: "Behavior preserved after refactor",
                    },
                    {
                        input: "xyzzy",
                        expectedOutput: "'xyzzy' not found.",
                        description: "Behavior preserved after refactor",
                    },
                ],
            },
            {
                order: 2,
                title: "Make Lookup Fast",
                instructions: "Make each dictionary look up run in O(1) time.",
                phases: [
                    {
                        order: 0,
                        interactionMode: InteractionMode.solo,
                        maxTimeSecs: 450,
                    },
                    {
                        order: 1,
                        interactionMode: InteractionMode.review,
                        maxTimeSecs: 300,
                    },
                    {
                        order: 2,
                        interactionMode: InteractionMode.collaborative,
                        maxTimeSecs: 300,
                    },
                ],
                testCases: [
                    {
                        input: "house",
                        expectedOutput: "'house' is spelled correctly.",
                        description: "Exact match still works",
                    },
                    {
                        input: "xyzzy",
                        expectedOutput: "'xyzzy' not found.",
                        description: "Non-match still works",
                    },
                ],
            },
            {
                order: 3,
                title: "Simple Typo Suggestions",
                instructions:
                    "Replace the current suggestion behavior with single-character substitution suggestions. When a word is not found, find all dictionary words of the same length that differ by exactly one character. Print them on the same line, sorted in increasing alphabetical order as: 'word' not found. Did you mean: ... If there are no suggestions, print only: 'word' not found.",
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
                    {
                        order: 2,
                        interactionMode: InteractionMode.collaborative,
                        maxTimeSecs: 600,
                    },
                ],
                testCases: [
                    {
                        input: "houze",
                        expectedOutput:
                            "'houze' not found. Did you mean: house mouse",
                        description:
                            "Same length, exactly one character different",
                    },
                    {
                        input: "cet",
                        expectedOutput:
                            "'cet' not found. Did you mean: cat cut",
                        description: "Short word suggestions",
                    },
                    {
                        input: "zzzz",
                        expectedOutput: "'zzzz' not found.",
                        description: "No suggestions",
                    },
                ],
            },
            {
                order: 4,
                title: "Faster Suggestions with Buckets",
                instructions:
                    "Speed up suggestion generation by grouping dictionary words by length. Build a map from length -> list of words. When generating suggestions, only scan the list for that length.",
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
                    {
                        order: 2,
                        interactionMode: InteractionMode.collaborative,
                        maxTimeSecs: 600,
                    },
                ],
                testCases: [
                    {
                        input: "houze",
                        expectedOutput:
                            "'houze' not found. Did you mean: house mouse",
                        description:
                            "Same length, exactly one character different",
                    },
                    {
                        input: "cet",
                        expectedOutput:
                            "'cet' not found. Did you mean: cat cut",
                        description: "Short word suggestions",
                    },
                    {
                        input: "zzzz",
                        expectedOutput: "'zzzz' not found.",
                        description: "No suggestions",
                    },
                ],
            },
            {
                order: 5,
                title: "Rank Suggestions and Limit Output",
                instructions:
                    "Consider suggestions that differ by more than a single letter. Improve suggestion quality by ranking suggestions and limiting output to the top 5. You may use a simple similarity score (for example, count matching character positions) or implement edit distance. If suggestions exist, print: 'word' not found. Did you mean: <up to 5 suggestions> Otherwise print only: 'word' not found.",
                phases: [
                    {
                        order: 0,
                        interactionMode: InteractionMode.solo,
                        maxTimeSecs: 900,
                    },
                    {
                        order: 1,
                        interactionMode: InteractionMode.review,
                        maxTimeSecs: 400,
                    },
                    {
                        order: 2,
                        interactionMode: InteractionMode.collaborative,
                        maxTimeSecs: 600,
                    },
                ],
                testCases: [
                    {
                        input: "houze",
                        expectedOutput:
                            "'houze' not found. Did you mean: house mouse horse",
                        description: "Ranked suggestions, best first",
                    },
                ],
            },
        ],
    }),
]
