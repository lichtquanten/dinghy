import { useStoreSelector } from "@workspace/pairing"
import { useSelf } from "@/lib/hooks/useSelf"
import { usePairingDoc } from "./usePairingDoc"

export function useSelfReady() {
    const pairing = usePairingDoc()
    const self = useSelf()
    const readyByUser = useStoreSelector(pairing.store, (s) => s.readyByUser)

    const isSelfReady = Boolean(readyByUser[self.id])

    const setSelfReady = (isReady: boolean) =>
        pairing.store.setReady(self.id, isReady)

    return { isSelfReady, setSelfReady }
}
