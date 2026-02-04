import { useRoom } from "@liveblocks/react/suspense"
import { getYjsProviderForRoom } from "@liveblocks/yjs"
import type { ReactNode } from "react"
import { useMemo } from "react"
import { YjsContext } from "./YjsContext"

export function YjsProvider({ children }: { children: ReactNode }) {
    const room = useRoom()

    const ctx = useMemo(() => {
        const provider = getYjsProviderForRoom(room)
        return {
            ydoc: provider.getYDoc(),
            awareness: provider.awareness,
        }
    }, [room])

    return <YjsContext.Provider value={ctx}>{children}</YjsContext.Provider>
}
