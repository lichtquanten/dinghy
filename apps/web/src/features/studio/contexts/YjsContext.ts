import type { getYjsProviderForRoom } from "@liveblocks/yjs"
import { createContext } from "react"
import type * as Y from "yjs"

type InternalLiveblocksAwareness = ReturnType<
    typeof getYjsProviderForRoom
>["awareness"]

export type LiveblocksAwareness = Pick<
    InternalLiveblocksAwareness,
    "getLocalState" | "setLocalState" | "on" | "off" | "setLocalStateField"
>

export interface YjsContextValue {
    ydoc: Y.Doc
    awareness: LiveblocksAwareness
}

export const YjsContext = createContext<YjsContextValue | null>(null)
