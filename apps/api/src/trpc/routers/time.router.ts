import { publicProcedure, router } from "@/trpc/trpc.js"

export const timeRouter = router({
    get: publicProcedure.query(() => Date.now()),
})
