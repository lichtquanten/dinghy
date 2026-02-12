import { TRPCError } from "@trpc/server"
import * as Y from "yjs"
import { z } from "zod"
import { createPairingStore, PairingRoomId } from "@workspace/pairing"
import { prisma } from "@/infrastructure/db.js"
import { liveblocks, sendYjsUpdate } from "@/integrations/liveblocks/client.js"
import { ensurePairingInitialized } from "@/services/pairing.js"
import { destroySession } from "@/services/session.js"
import { protectedProcedure, router } from "@/trpc/trpc.js"

async function findPairingForUser(pairingId: string, userId: string) {
    const pairing = await prisma.pairing.findUnique({
        where: { id: pairingId },
        include: {
            partners: true,
            session: true,
            assignment: {
                include: {
                    tasks: {
                        include: { phases: true },
                        orderBy: { order: "asc" },
                    },
                },
            },
        },
    })

    if (!pairing) {
        throw new TRPCError({ code: "NOT_FOUND" })
    }

    if (!pairing.partnerIds.includes(userId)) {
        throw new TRPCError({ code: "FORBIDDEN" })
    }

    return pairing
}

function getPartner(
    pairing: Awaited<ReturnType<typeof findPairingForUser>>,
    userId: string
) {
    const partner = pairing.partners.find((p) => p.id !== userId)

    if (!partner) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Pairing has no partner",
        })
    }

    return {
        firstName: partner.firstName,
        lastInitial: partner.lastName[0],
    }
}

async function completePairing(pairingId: string, sessionId?: string) {
    await prisma.pairing.update({
        where: { id: pairingId },
        data: { status: "COMPLETED" },
    })

    if (sessionId) {
        setTimeout(() => void destroySession(sessionId), 5000)
    }
}

export const pairingRouter = router({
    init: protectedProcedure
        .input(z.object({ pairingId: z.string() }))
        .query(async ({ ctx, input }) => {
            const pairing = await findPairingForUser(
                input.pairingId,
                ctx.userId
            )

            if (pairing.partnerIds.length !== 2) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Pairing requires exactly 2 partners",
                })
            }

            await ensurePairingInitialized(pairing.id)
            return {}
        }),

    get: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const pairing = await findPairingForUser(input.id, ctx.userId)

            return {
                pairingId: pairing.id,
                assignmentId: pairing.assignmentId,
                partner: getPartner(pairing, ctx.userId),
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
                include: { partners: true },
            })

            if (!pairing) return null

            const partner = pairing.partners.find((p) => p.id !== ctx.userId)

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

    advancePhase: protectedProcedure
        .input(z.object({ pairingId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const pairing = await findPairingForUser(
                input.pairingId,
                ctx.userId
            )

            if (pairing.status === "COMPLETED") return

            const roomId = PairingRoomId.from(input.pairingId)
            const ydoc = new Y.Doc()
            const update = await liveblocks.getYjsDocumentAsBinaryUpdate(roomId)
            Y.applyUpdate(ydoc, new Uint8Array(update))

            const store = createPairingStore(ydoc)
            const state = store.get()
            const tasks = pairing.assignment.tasks
            const currentTask = tasks[state.taskIndex]

            if (!currentTask) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Invalid task index: ${state.taskIndex}`,
                })
            }

            const isLastPhase =
                state.phaseIndex >= currentTask.phases.length - 1
            const isLastTask = state.taskIndex >= tasks.length - 1

            if (isLastPhase && isLastTask) {
                store.complete()
                await sendYjsUpdate(roomId, ydoc)
                await completePairing(pairing.id, pairing.session?.id)
            } else if (isLastPhase) {
                store.advanceTask()
                await sendYjsUpdate(roomId, ydoc)
            } else {
                store.advancePhase(Date.now())
                await sendYjsUpdate(roomId, ydoc)
            }
        }),
})
