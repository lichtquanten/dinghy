import { useMemo } from "react"
import { useSelf } from "@/lib/hooks/useSelf"
import { useAssignment } from "./assignment"

function pickPrimary(partnerIds: string[]): string {
    const sorted = [...partnerIds].sort()
    const primary = sorted[0]
    if (!primary) throw new Error("partnerIds cannot be empty")
    return primary
}

export function usePairingId() {
    const assignment = useAssignment()
    if (!assignment.pairing)
        throw new Error("Must have pairing to use usePartner")
    return assignment.pairing.id
}

export function usePartner() {
    const assignment = useAssignment()
    if (!assignment.pairing)
        throw new Error("Must have pairing to use usePartner")
    return assignment.pairing.partner
}

export function usePartnerIds() {
    const assignment = useAssignment()
    const self = useSelf()

    if (!assignment.pairing)
        throw new Error("Must have pairing to use usePartner")

    const partnerId = assignment.pairing.partner.id

    return useMemo(() => [partnerId, self.id], [partnerId, self.id])
}

export function useIsPrimary(): boolean {
    const self = useSelf()
    const partnerIds = usePartnerIds()
    return self.id === pickPrimary(partnerIds)
}
