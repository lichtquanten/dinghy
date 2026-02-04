import { Hono } from "hono"
import { z } from "zod"
import { RoomId } from "@workspace/collab"
import { prisma } from "@/infrastructure/db.js"
import { getToken } from "@/integrations/liveblocks/client.js"
import { requireAuth } from "@/middleware/auth.js"
import { ensurePairingInitialized } from "@/services/pairing.js"

export const routes = new Hono()

const inputSchema = z.object({
    room: z.string(),
})

routes.post("/token", requireAuth, async (c) => {
    const userId = c.get("userId")

    const { data: body, success } = inputSchema.safeParse(await c.req.json())
    if (!success) {
        return c.json({ error: "Invalid request" }, 400)
    }

    const pairingId = RoomId.toPairingId(body.room)

    if (!pairingId) {
        return c.json({ error: "Invalid request" }, 400)
    }

    const pairing = await prisma.pairing.findUnique({
        where: { id: pairingId },
        include: { assignment: true },
    })

    if (!pairing || !pairing.partnerIds.includes(userId)) {
        return c.json({ error: "Forbidden" }, 403)
    }

    if (!pairing.yjsInitialized) {
        await ensurePairingInitialized(
            pairing.id,
            pairing.partnerIds,
            pairing.assignment.starterCode
        )
    }

    const token = await getToken(userId, RoomId.fromPairingId(pairing.id))

    return c.json({ token })
})
