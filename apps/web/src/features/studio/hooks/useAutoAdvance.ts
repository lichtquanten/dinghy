// hooks/useAutoAdvance.ts
import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"
import { trpc } from "@/lib/trpc"
import { useIsPrimary, usePairingId } from "./pairing"
import { usePhaseTimer } from "./usePhaseTimer"
import { useReadiness } from "./useReadiness"

export function useAutoAdvance() {
    const pairingId = usePairingId()
    const isPrimary = useIsPrimary()
    const { isReady, isPartnerReady } = useReadiness()
    const { countdownToForced } = usePhaseTimer()
    const { mutate } = useMutation(trpc.pairing.advancePhase.mutationOptions())

    const isBothReady = isReady && isPartnerReady

    useEffect(() => {
        if (isBothReady && isPrimary) {
            mutate({ pairingId })
        }
    }, [isBothReady, isPrimary, pairingId, mutate])

    useEffect(() => {
        if (countdownToForced === null || !isPrimary) return
        if (countdownToForced <= 0) {
            mutate({ pairingId })
            return
        }
        const timer = setTimeout(() => {
            mutate({ pairingId })
        }, countdownToForced * 1000)
        return () => clearTimeout(timer)
    }, [countdownToForced, isPrimary, pairingId, mutate])
}
