import { LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense"
import { type ReactNode, Suspense } from "react"
import { PairingRoomId } from "@workspace/pairing"
import { FullPageLoader } from "@/lib/components/FullPageLoader.js"
import { usePartnerIds } from "../hooks/pairing"
import { useAutoAdvance } from "../hooks/useAutoAdvance"
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
                <Suspense fallback={<FullPageLoader />}>
                    <YjsProvider>
                        <PairingDocProvider partnerIds={partnerIds}>
                            <StudioInner>{children}</StudioInner>
                        </PairingDocProvider>
                    </YjsProvider>
                </Suspense>
            </RoomProvider>
        </LiveblocksProvider>
    )
}

function StudioInner({ children }: { children: ReactNode }) {
    useAutoAdvance()
    return <>{children}</>
}
