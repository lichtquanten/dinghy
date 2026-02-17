import { useStoreSelector } from "@workspace/pairing/react"
import { useCurrentPhase } from "./progress"
import { useIsPartnerReady } from "./useIsPartnerReady"
import { usePairingDoc } from "./usePairingDoc"
import { usePhaseSecsRemaining } from "./usePhaseSecsRemaining"
import { useSelfReady } from "./useSelfReady"

export type PhaseStatus =
    | { status: "paused" }
    | { status: "locked"; secsRemaining: number }
    | { status: "unlocked" }
    | { status: "partnerWaiting"; secsRemaining: number | null }
    | { status: "waiting"; secsRemaining: number | null }
    | { status: "advancing" }

export function usePhaseStatus(): PhaseStatus {
    const pairing = usePairingDoc()
    const phase = useCurrentPhase()
    const secsRemaining = usePhaseSecsRemaining()
    const isPaused = useStoreSelector(pairing.store, (s) => s.isPaused)
    const { isSelfReady } = useSelfReady()
    const isPartnerReady = useIsPartnerReady()

    if (isPaused) return { status: "paused" }

    const minTime = phase?.minTimeSecs ?? 0
    const maxTime = phase?.maxTimeSecs ?? null

    const elapsed =
        secsRemaining != null && maxTime != null ? maxTime - secsRemaining : 0

    if (elapsed < minTime) {
        return {
            status: "locked",
            secsRemaining: Math.max(0, minTime - elapsed),
        }
    }

    if (isSelfReady && isPartnerReady) return { status: "advancing" }
    if (isSelfReady) return { status: "waiting", secsRemaining }
    if (isPartnerReady) return { status: "partnerWaiting", secsRemaining }
    return { status: "unlocked" }
}
