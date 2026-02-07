import { type ReactNode, useMemo } from "react"
import { getPairingDoc } from "@workspace/pairing"
import { PairingDocContext } from "../contexts/PairingDocContext"
import { useYjs } from "../hooks/useYjs"

export function PairingDocProvider({
    partnerIds,
    children,
}: {
    partnerIds: string[]
    children: ReactNode
}) {
    const { ydoc } = useYjs()
    const pairing = useMemo(
        () => getPairingDoc(ydoc, partnerIds),
        [ydoc, partnerIds]
    )

    return (
        <PairingDocContext.Provider value={pairing}>
            {children}
        </PairingDocContext.Provider>
    )
}
