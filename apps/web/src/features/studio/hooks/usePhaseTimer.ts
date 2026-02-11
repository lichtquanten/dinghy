import { useEffect, useState } from "react"
import { useStoreSelector } from "@workspace/pairing"
import { useCurrentPhase } from "./progress"
import { useSecondsSince } from "./time"
import { usePairingDoc } from "./usePairingDoc"

export function usePhaseTimer() {
    const secondsSince = useSecondsSince()
    const phase = useCurrentPhase()
    const pairing = usePairingDoc()
    const phaseStartedAt = useStoreSelector(
        pairing.store,
        (s) => s.phaseStartedAt
    )

    const minTime = phase?.minTimeSecs ?? 0
    const maxTime = phase?.maxTimeSecs ?? null

    const [elapsed, setElapsed] = useState(0)

    useEffect(() => {
        if (!phaseStartedAt) return

        const tick = () => setElapsed(secondsSince(phaseStartedAt))
        tick()
        const interval = setInterval(tick, 1000)
        return () => clearInterval(interval)
    }, [phaseStartedAt, secondsSince])

    return {
        elapsed,
        canReady: elapsed >= minTime,
        countdownToReady: Math.max(0, minTime - elapsed),
        countdownToForced: maxTime ? Math.max(0, maxTime - elapsed) : null,
    }
}
