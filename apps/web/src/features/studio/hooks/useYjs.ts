import { useContext } from "react"
import { YjsContext } from "../contexts/YjsContext"

export function useYjs() {
    const ctx = useContext(YjsContext)

    if (!ctx) {
        throw new Error("useYjs must be used within YjsProvider")
    }

    return ctx
}
