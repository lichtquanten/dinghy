import { createContext } from "react"
import { type PairingDoc } from "@workspace/pairing"

export const PairingDocContext = createContext<PairingDoc | null>(null)
