import { useStoreSelector } from "@workspace/pairing"
import { useSelf } from "@/lib/hooks/useSelf"
import { usePairingDoc } from "./usePairingDoc"

export function useReadiness() {
    const pairing = usePairingDoc()
    const self = useSelf()
    const ready = useStoreSelector(pairing.store, (s) => s.ready)

    const isReady = ready[self.id] ?? false
    const isPartnerReady = Object.entries(ready).some(
        ([id, r]) => id !== self.id && r
    )

    return {
        isReady,
        isPartnerReady,
        toggleReady: () => pairing.store.setReady(self.id, !isReady),
    }
}
