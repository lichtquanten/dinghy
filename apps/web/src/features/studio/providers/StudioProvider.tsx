import { LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense"
import { type ReactNode } from "react"
import { PairingRoomId } from "@workspace/pairing"
import { usePartnerIds } from "../hooks/pairing"
import { usePhaseProgression } from "../hooks/usePhaseProgression.js"
import { PairingDocProvider } from "./PairingDocProvider"
import { YjsProvider } from "./YjsProvider"

export function StudioProvider({
    pairingId,
    children,
}: {
    pairingId: string
    children: ReactNode
}) {
    const roomId = PairingRoomId.from(pairingId)
    const partnerIds = usePartnerIds()

    return (
        <LiveblocksProvider
            authEndpoint="/api/liveblocks/token"
            badgeLocation="bottom-left"
        >
            <RoomProvider id={roomId}>
                <YjsProvider>
                    <PairingDocProvider partnerIds={partnerIds}>
                        <StudioInner>{children}</StudioInner>
                    </PairingDocProvider>
                </YjsProvider>
            </RoomProvider>
        </LiveblocksProvider>
    )
}

function StudioInner({ children }: { children: ReactNode }) {
    usePhaseProgression()
    return <>{children}</>
}
