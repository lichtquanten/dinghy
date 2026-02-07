import { useRoom } from "@liveblocks/react/suspense"
import { getYjsProviderForRoom } from "@liveblocks/yjs"
import type { ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"
import { FullPageLoader } from "@/lib/components/FullPageLoader"
import { YjsContext } from "../contexts/YjsContext"

export function YjsProvider({ children }: { children: ReactNode }) {
    const room = useRoom()

    const { provider, ydoc, awareness } = useMemo(() => {
        const provider = getYjsProviderForRoom(room)
        return {
            provider,
            ydoc: provider.getYDoc(),
            awareness: provider.awareness,
        }
    }, [room])

    const [synced, setSynced] = useState(() => provider.synced)

    useEffect(() => {
        if (provider.synced) return

        function handler(s: boolean) {
            if (s) {
                setSynced(true)
                provider.off("sync", handler)
            }
        }

        provider.on("sync", handler)
        return () => provider.off("sync", handler)
    }, [provider])

    if (!synced) return <FullPageLoader />

    return (
        <YjsContext.Provider value={{ ydoc, awareness }}>
            {children}
        </YjsContext.Provider>
    )
}
