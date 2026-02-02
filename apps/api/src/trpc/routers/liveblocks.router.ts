import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { getRoomId } from "@workspace/collab"
import { prisma } from "@/infrastructure/db.js"
import { getToken } from "@/integrations/liveblocks/client.js"
import { ensurePairingInitialized } from "@/services/pairing.js"
import { protectedProcedure, router } from "@/trpc/trpc.js"

export const liveblocksRouter = router({
    getToken: protectedProcedure
        .input(z.object({ pairingId: z.string() }))
        .query(async ({ ctx, input }) => {
            const pairing = await prisma.pairing.findUnique({
                where: { id: input.pairingId },
                include: { assignment: true },
            })

            if (!pairing || !pairing.partnerIds.includes(ctx.userId)) {
                throw new TRPCError({ code: "FORBIDDEN" })
            }

            if (!pairing.yjsInitialized) {
                await ensurePairingInitialized(
                    pairing.id,
                    pairing.partnerIds,
                    pairing.assignment.starterCode
                )
            }

            return await getToken(ctx.userId, getRoomId(pairing.id))
        }),
})
