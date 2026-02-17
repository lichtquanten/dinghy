import { useEffect, useRef } from "react"
import { useStoreSelector } from "@workspace/pairing/react"
import { usePartnerIds } from "./pairing"
import { usePairingDoc } from "./usePairingDoc"

export function useAllReady(onAllReady?: () => void) {
    const pairing = usePairingDoc()
    const partnerIds = usePartnerIds()
    const readyByUser = useStoreSelector(pairing.store, (s) => s.readyByUser)
    const hasFired = useRef(false)

    const isAllReady = partnerIds.every((id) => !!readyByUser[id])

    useEffect(() => {
        if (!onAllReady) return
        if (isAllReady && !hasFired.current) {
            hasFired.current = true
            onAllReady()
        } else if (!isAllReady) {
            hasFired.current = false
        }
    }, [isAllReady, onAllReady])

    return { isAllReady }
}
