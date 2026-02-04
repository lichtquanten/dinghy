import { z } from "zod"
import { CodeLanguage } from "@workspace/db/client"
import { prisma } from "@/infrastructure/db.js"
import * as execution from "@/services/execution.js"
import { protectedProcedure, router } from "@/trpc/trpc.js"

export const executionRouter = router({
    run: protectedProcedure
        .input(
            z.object({
                code: z.string().min(1),
                language: z.enum(CodeLanguage),
                stdin: z.string().default(""),
            })
        )
        .subscription(async function* ({ input, signal }) {
            const result = await execution.run(input, signal)
            yield result
        }),

    runTests: protectedProcedure
        .input(
            z.object({
                assignmentId: z.string(),
                taskIndex: z.number(),
                code: z.string().min(1),
            })
        )
        .subscription(async function* ({ input, signal }) {
            const task = await prisma.task.findFirstOrThrow({
                where: {
                    assignmentId: input.assignmentId,
                    order: input.taskIndex,
                },
                include: {
                    testCases: true,
                    assignment: true,
                },
            })

            const pending = task.testCases.map(async (testCase, index) => {
                const result = await execution.run(
                    {
                        code: input.code,
                        language: task.assignment.codeLanguage,
                        stdin: testCase.input,
                    },
                    signal
                )

                return {
                    index,
                    passed:
                        result.status === "success" &&
                        result.stdout.trim() === testCase.expectedOutput.trim(),
                    result,
                }
            })

            for (const promise of pending) {
                yield await promise
            }
        }),
})
