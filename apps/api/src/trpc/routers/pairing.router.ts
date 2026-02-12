import { TRPCError } from "@trpc/server"
import * as Y from "yjs"
import { z } from "zod"
import { PairingRoomId } from "@workspace/pairing"
import { createPairingStore } from "@workspace/pairing"
import { prisma } from "@/infrastructure/db.js"
import { liveblocks, sendYjsUpdate } from "@/integrations/liveblocks/client.js"
import { ensurePairingInitialized } from "@/services/pairing.js"
import { destroySession } from "@/services/session.js"
import { protectedProcedure, router } from "@/trpc/trpc.js"

export const pairingRouter = router({
    init: protectedProcedure
        .input(z.object({ pairingId: z.string() }))
        .query(async ({ ctx, input }) => {
            const pairing = await prisma.pairing.findUnique({
                where: { id: input.pairingId },
                include: {
                    partners: true,
                    assignment: true,
                },
            })

            if (!pairing) {
                throw new TRPCError({ code: "NOT_FOUND" })
            }

            if (!pairing.partnerIds.includes(ctx.userId)) {
                throw new TRPCError({ code: "FORBIDDEN" })
            }

            if (!(pairing.partnerIds.length === 2)) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Pairing has no partner",
                })
            }
            await ensurePairingInitialized(pairing.id)
        }),
    get: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const pairing = await prisma.pairing.findUnique({
                where: { id: input.id },
                include: { partners: true, session: true },
            })

            if (!pairing) {
                throw new TRPCError({ code: "NOT_FOUND" })
            }

            if (!pairing.partnerIds.includes(ctx.userId)) {
                throw new TRPCError({ code: "FORBIDDEN" })
            }

            const partner = pairing.partners.find((m) => m.id !== ctx.userId)
            if (!partner) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Pairing has no partner",
                })
            }

            return {
                pairingId: pairing.id,
                assignmentId: pairing.assignmentId,
                partner: {
                    firstName: partner.firstName,
                    lastInitial: partner.lastName[0],
                },
                status: pairing.status,
            }
        }),
    getByAssignment: protectedProcedure
        .input(z.object({ assignmentId: z.string() }))
        .query(async ({ ctx, input }) => {
            const pairing = await prisma.pairing.findFirst({
                where: {
                    assignmentId: input.assignmentId,
                    partnerIds: { has: ctx.userId },
                },
                include: { partners: true, session: true },
            })

            if (!pairing) {
                return null
            }

            const partner = pairing.partners.find((m) => m.id !== ctx.userId)
            if (!partner) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Pairing has no partner",
                })
            }

            return {
                pairingId: pairing.id,
                partner: {
                    firstName: partner.firstName,
                    lastInitial: partner.lastName[0],
                },
                status: pairing.status,
            }
        }),
    complete: protectedProcedure
        .input(z.object({ pairingId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const pairing = await prisma.pairing.findUnique({
                where: { id: input.pairingId },
                include: { session: true },
            })

            if (!pairing) {
                throw new TRPCError({ code: "NOT_FOUND" })
            }

            if (!pairing.partnerIds.includes(ctx.userId)) {
                throw new TRPCError({ code: "FORBIDDEN" })
            }

            if (pairing.status === "COMPLETED") {
                return
            }

            if (pairing.session) {
                await destroySession(pairing.session.id)
            }
            await prisma.pairing.update({
                where: { id: input.pairingId },
                data: { status: "COMPLETED" },
            })
        }),
    advancePhase: protectedProcedure
        .input(z.object({ pairingId: z.string() }))
        .mutation(async ({ input }) => {
            const roomId = PairingRoomId.from(input.pairingId)
            const ydoc = new Y.Doc()

            const update = await liveblocks.getYjsDocumentAsBinaryUpdate(roomId)
            Y.applyUpdate(ydoc, new Uint8Array(update))

            const store = createPairingStore(ydoc)
            store.advancePhase(Date.now())

            await sendYjsUpdate(roomId, ydoc)
        }),
})
