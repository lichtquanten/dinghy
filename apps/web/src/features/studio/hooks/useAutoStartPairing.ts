import { useMutation } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { trpc } from "@/lib/trpc"
import { usePairingId } from "./pairing"
import { useIsPartnerOnline } from "./useIsPartnerOnline"

export function useAutoStartPairing() {
    const pairingId = usePairingId()
    const isPartnerOnline = useIsPartnerOnline()
    const hasFired = useRef(false)

    const { mutate } = useMutation(trpc.pairing.startPairing.mutationOptions())

    useEffect(() => {
        if (isPartnerOnline && !hasFired.current) {
            hasFired.current = true
            mutate({ pairingId })
        }
    }, [isPartnerOnline, pairingId, mutate])
}
