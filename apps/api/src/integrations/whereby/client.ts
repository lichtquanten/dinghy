import createClient from "openapi-fetch"
import { env } from "@/config/env.js"
import type { paths } from "./types.js"

const whereby = createClient<paths>({
    baseUrl: "https://api.whereby.dev/v1",
    headers: {
        Authorization: `Bearer ${env.WHEREBY_API_KEY}`,
    },
})

export async function createMeeting(durationMinutes = 24 * 60) {
    const endDate = new Date(
        Date.now() + durationMinutes * 60 * 1000
    ).toISOString()

    const { data, error } = await whereby.POST("/meetings", {
        body: { endDate },
    })

    if (error)
        throw new Error("Failed to create Whereby meeting", { cause: error })
    if (!data) {
        throw new Error("Whereby returned no data")
    }
    return data
}

export async function deleteMeeting(meetingId: string) {
    const { error } = await whereby.DELETE("/meetings/{meetingId}", {
        params: {
            path: { meetingId },
        },
    })

    if (error) {
        throw new Error("Failed to delete Whereby meeting", { cause: error })
    }
}
