import { useSuspenseQuery } from "@tanstack/react-query"
import { trpc } from "@/lib/trpc"
import { usePairingId } from "./pairing"

export function useWherebyMeetingUrl() {
    const pairingId = usePairingId()

    const { data: session } = useSuspenseQuery(
        trpc.session.get.queryOptions({ pairingId })
    )
    if (session?.wherebyMeetingUrl) {
        return session.wherebyMeetingUrl
    }
    throw new Error("No Whereby meeting URL in session")
}
