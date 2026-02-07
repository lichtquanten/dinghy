import { useEffect } from "react"
import { useStoreSelector } from "@workspace/pairing"
import { useSelf } from "@/lib/hooks/useSelf"
import { useIsPrimary } from "./pairing"
import { usePairingDoc } from "./usePairingDoc"

export function usePhaseProgression(timeoutMs = 30_000) {
    const pairing = usePairingDoc()
    const self = useSelf()

    const ready = useStoreSelector(pairing.store, (s) => s.ready)
    const isPrimary = useIsPrimary()

    const myReady = ready[self.id] ?? false
    const partnerReady = Object.entries(ready).some(
        ([id, isReady]) => id !== self.id && isReady
    )
    const bothReady = myReady && partnerReady

    useEffect(() => {
        if (bothReady && isPrimary) {
            pairing.store.advancePhase()
        }
    }, [bothReady, isPrimary, pairing.store])

    useEffect(() => {
        if (!partnerReady || myReady) return

        const timer = setTimeout(() => {
            if (isPrimary) {
                pairing.store.advancePhase()
            }
        }, timeoutMs)

        return () => clearTimeout(timer)
    }, [partnerReady, myReady, isPrimary, pairing.store, timeoutMs])
}
