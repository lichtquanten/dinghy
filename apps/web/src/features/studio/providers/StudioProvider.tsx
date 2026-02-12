import { LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense"
import type { ReactNode } from "react"
import { Suspense } from "react"
import { PairingRoomId } from "@workspace/pairing"
import { FullPageLoader } from "@/lib/components/FullPageLoader.js"
import { Lobby } from "../components/Lobby"
import { PairingInit } from "../components/PairingInit"
import { SessionInit } from "../components/SessionInit"
import { usePairingId, usePartnerIds } from "../hooks/pairing"
import { useAutoAdvance } from "../hooks/useAutoAdvance"
import { usePairingComplete } from "../hooks/usePairingComplete"
import { PairingDocProvider } from "./PairingDocProvider"
import { YjsProvider } from "./YjsProvider"

export function StudioProvider({ children }: { children: ReactNode }) {
    const pairingId = usePairingId()
    const partnerIds = usePartnerIds()
    const roomId = PairingRoomId.from(pairingId)

    return (
        <PairingInit pairingId={pairingId}>
            <SessionInit pairingId={pairingId}>
                <LiveblocksProvider
                    authEndpoint="/api/liveblocks/token"
                    badgeLocation="bottom-left"
                >
                    <RoomProvider id={roomId}>
                        <Suspense fallback={<FullPageLoader />}>
                            <YjsProvider>
                                <PairingDocProvider partnerIds={partnerIds}>
                                    <Lobby>
                                        <AutoAdvance />
                                        <PairingComplete />
                                        {children}
                                    </Lobby>
                                </PairingDocProvider>
                            </YjsProvider>
                        </Suspense>
                    </RoomProvider>
                </LiveblocksProvider>
            </SessionInit>
        </PairingInit>
    )
}

function AutoAdvance() {
    useAutoAdvance()
    return null
}

function PairingComplete() {
    usePairingComplete()
    return null
}
