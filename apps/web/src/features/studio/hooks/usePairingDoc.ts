import { useContext } from "react"
import { PairingDocContext } from "../contexts/PairingDocContext"

export function usePairingDoc() {
    const ctx = useContext(PairingDocContext)
    if (!ctx)
        throw new Error("usePairingDoc must be used within PairingDocProvider")
    return ctx
}
