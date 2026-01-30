import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { prisma } from "@/infrastructure/db.js"
import { getToken } from "@/integrations/liveblocks/client.js"
import { protectedProcedure, router } from "@/trpc/trpc.js"

export const liveblocksRouter = router({
    getToken: protectedProcedure
        .input(z.object({ pairingId: z.string() }))
        .query(async ({ ctx, input }) => {
            const pairing = await prisma.pairing.findUnique({
                where: { id: input.pairingId },
            })

            if (!pairing || !pairing.memberIds.includes(ctx.userId)) {
                throw new TRPCError({ code: "FORBIDDEN" })
            }

            return await getToken(ctx.userId, `pairing:${pairing.id}`)
        }),
})
