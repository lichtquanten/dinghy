import { Hono } from "hono"
import { z } from "zod"
import { PairingRoomId } from "@workspace/pairing"
import { prisma } from "@/infrastructure/db.js"
import { getToken } from "@/integrations/liveblocks/client.js"
import { requireAuth } from "@/middleware/auth.js"

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

    const pairingId = PairingRoomId.parse(body.room)
    if (!pairingId) {
        return c.json({ error: "Invalid request" }, 400)
    }

    const pairing = await prisma.pairing.findUnique({
        where: { id: pairingId },
    })

    if (!pairing || !pairing.partnerIds.includes(userId)) {
        return c.json({ error: "Forbidden" }, 403)
    }

    const token = await getToken(userId, PairingRoomId.from(pairing.id))
    return c.json({ token })
})
