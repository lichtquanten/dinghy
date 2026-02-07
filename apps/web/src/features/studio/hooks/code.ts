import { useSelf } from "@/lib/hooks/useSelf"
import { usePartner } from "./pairing"
import { usePairingDoc } from "./usePairingDoc"

export function useMyCode() {
    const pairingDoc = usePairingDoc()
    const self = useSelf()

    const myCode = pairingDoc.userCode[self.id]
    if (!myCode) throw new Error("User code not found")

    return myCode
}

export function usePartnerCode() {
    const pairingDoc = usePairingDoc()
    const partner = usePartner()

    const partnerCode = pairingDoc.userCode[partner.id]
    if (!partnerCode) throw new Error("User code not found")

    return partnerCode
}

export function useSharedCode() {
    const pairingDoc = usePairingDoc()
    const sharedCode = pairingDoc.sharedCode
    if (!sharedCode) throw new Error("User code not found")
    return sharedCode
}
