import type { ReactNode } from "react"
import { useStoreSelector } from "@workspace/pairing"
import { useAutoAdvancePhase } from "../hooks/useAutoAdvancePhase"
import { usePairingDoc } from "../hooks/usePairingDoc"
import { useRedirectOnPairingComplete } from "../hooks/useRedirectOnPairingComplete"
import { Lobby } from "./Lobby"
import { PausedOverlay } from "./PausedOverlay"

export function PairingGate({ children }: { children: ReactNode }) {
    const pairing = usePairingDoc()
    const isStarted = useStoreSelector(pairing.store, (s) => s.isStarted)
    const isPaused = useStoreSelector(pairing.store, (s) => s.isPaused)

    if (!isStarted) return <Lobby />

    return (
        <>
            <AutoAdvancePhase />
            <RedirectOnPairingComplete />
            {children}
            {isPaused && <PausedOverlay />}
        </>
    )
}

function AutoAdvancePhase() {
    useAutoAdvancePhase()
    return null
}

function RedirectOnPairingComplete() {
    useRedirectOnPairingComplete()
    return null
}
