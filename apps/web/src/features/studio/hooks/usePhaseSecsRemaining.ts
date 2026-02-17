import { useEffect, useState } from "react"
import { useStoreSelector } from "@workspace/pairing/react"
import { usePairingDoc } from "./usePairingDoc"

function computeTimeLeft(
    phaseSecsRemaining: number,
    phaseTickingSince: number
): number {
    const elapsed = (Date.now() - phaseTickingSince) / 1000
    return Math.max(0, phaseSecsRemaining - elapsed)
}

export function usePhaseSecsRemaining(): number | null {
    const pairing = usePairingDoc()
    const phaseSecsRemaining = useStoreSelector(
        pairing.store,
        (s) => s.phaseSecsRemaining
    )
    const phaseTickingSince = useStoreSelector(
        pairing.store,
        (s) => s.phaseTickingSince
    )
    const isPaused = useStoreSelector(pairing.store, (s) => s.isPaused)

    const isRunning =
        phaseSecsRemaining != null && phaseTickingSince != null && !isPaused

    const [_, setTick] = useState(0)

    useEffect(() => {
        if (!isRunning) return

        const interval = setInterval(() => setTick((t) => t + 1), 200)
        return () => clearInterval(interval)
    }, [isRunning])

    if (phaseSecsRemaining == null) return null
    if (isPaused || phaseTickingSince == null) return phaseSecsRemaining
    return computeTimeLeft(phaseSecsRemaining, phaseTickingSince)
}
