import { useEffect, useState } from "react"
import { useStoreSelector } from "@workspace/pairing"
import { useCurrentPhase } from "./progress"
import { useSecondsSince } from "./time"
import { usePairingDoc } from "./usePairingDoc"
import { useReadiness } from "./useReadiness"

export type PhaseStatus =
    | { status: "locked"; countdown: number }
    | { status: "unlocked" }
    | { status: "partnerWaiting"; countdown: number | null }
    | { status: "waiting"; countdown: number | null }
    | { status: "advancing" }

function useElapsed() {
    const secondsSince = useSecondsSince()
    const pairing = usePairingDoc()
    const phaseStartedAt = useStoreSelector(
        pairing.store,
        (s) => s.phaseStartedAt
    )

    const [elapsed, setElapsed] = useState(0)

    useEffect(() => {
        if (!phaseStartedAt) return
        const tick = () => setElapsed(secondsSince(phaseStartedAt))
        tick()
        const interval = setInterval(tick, 1000)
        return () => clearInterval(interval)
    }, [phaseStartedAt, secondsSince])

    return elapsed
}

function deriveStatus(
    elapsed: number,
    minTime: number,
    maxTime: number | null,
    isReady: boolean,
    isPartnerReady: boolean
): PhaseStatus {
    const countdownToForced = maxTime ? Math.max(0, maxTime - elapsed) : null

    if (elapsed < minTime)
        return { status: "locked", countdown: Math.max(0, minTime - elapsed) }
    if (isReady && isPartnerReady) return { status: "advancing" }
    if (isReady) return { status: "waiting", countdown: countdownToForced }
    if (isPartnerReady)
        return { status: "partnerWaiting", countdown: countdownToForced }
    return { status: "unlocked" }
}

export function usePhaseStatus(): PhaseStatus {
    const phase = useCurrentPhase()
    const { isReady, isPartnerReady } = useReadiness()
    const elapsed = useElapsed()

    return deriveStatus(
        elapsed,
        phase?.minTimeSecs ?? 0,
        phase?.maxTimeSecs ?? null,
        isReady,
        isPartnerReady
    )
}
