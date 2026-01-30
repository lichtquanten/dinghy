import { Liveblocks } from "@liveblocks/node"
import { z } from "zod"
import { env } from "@/config/env.js"

const authSchema = z.object({
    token: z.string(),
})

const liveblocks = new Liveblocks({
    secret: env.LIVEBLOCKS_SECRET_KEY,
})

export async function getToken(userId: string, roomId: string) {
    const session = liveblocks.prepareSession(userId)

    session.allow(roomId, session.FULL_ACCESS)

    const { body, status } = await session.authorize()

    if (status !== 200) {
        throw new Error(`Failed to authorize Liveblocks session: ${status}`)
    }

    const { token } = authSchema.parse(JSON.parse(body))
    return token
}
