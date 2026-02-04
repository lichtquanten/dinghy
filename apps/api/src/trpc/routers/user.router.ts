import { prisma } from "@/infrastructure/db.js"
import { protectedProcedure, router } from "@/trpc/trpc.js"

export const userRouter = router({
    self: protectedProcedure.query(({ ctx }) => {
        return prisma.user.findUniqueOrThrow({
            where: {
                id: ctx.userId,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
            },
        })
    }),
})

export type UserRouter = typeof userRouter
