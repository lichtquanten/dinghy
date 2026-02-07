import { useRoom } from "@liveblocks/react/suspense"
import type { LiveblocksYjsProvider } from "@liveblocks/yjs"
import { getYjsProviderForRoom } from "@liveblocks/yjs"
import type { ReactNode } from "react"
import { useMemo } from "react"
import { YjsContext } from "../contexts/YjsContext"

const syncPromiseCache = new WeakMap<LiveblocksYjsProvider, Promise<void>>()

function useSyncedProvider(provider: LiveblocksYjsProvider) {
    if (provider.synced) return

    let syncPromise = syncPromiseCache.get(provider)

    if (!syncPromise) {
        syncPromise = new Promise<void>((resolve) => {
            if (provider.synced) {
                resolve()
            } else {
                const handler = (synced: boolean) => {
                    if (synced) {
                        provider.off("sync", handler)
                        resolve()
                    }
                }
                provider.on("sync", handler)
            }
        })
        syncPromiseCache.set(provider, syncPromise)
    }

    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw syncPromise
}

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

    useSyncedProvider(provider)

    return (
        <YjsContext.Provider value={{ ydoc, awareness }}>
            {children}
        </YjsContext.Provider>
    )
}
