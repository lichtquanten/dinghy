import { useEffect, useState } from "react"
import { createAwarenessStore } from "../lib/awareness"
import { usePartner } from "./pairing"
import { useYjs } from "./useYjs"

export function useIsPartnerOnline() {
    const { awareness } = useYjs()
    const partner = usePartner()
    const [isOnline, setIsOnline] = useState(false)

    useEffect(() => {
        const store = createAwarenessStore(awareness)

        const check = () => setIsOnline(store.isOnline(partner.id))
        check()
        return store.subscribe(check)
    }, [awareness, partner.id])

    return isOnline
}
