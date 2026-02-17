import { useStoreSelector } from "@workspace/pairing/react"
import { useSelf } from "@/lib/hooks/useSelf"
import { usePairingDoc } from "./usePairingDoc"

export function useIsPartnerReady() {
    const pairing = usePairingDoc()
    const self = useSelf()
    const readyByUser = useStoreSelector(pairing.store, (s) => s.readyByUser)

    return Object.entries(readyByUser).some(([id, r]) => id !== self.id && r)
}
