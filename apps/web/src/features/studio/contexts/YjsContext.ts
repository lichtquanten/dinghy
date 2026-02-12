import type { LiveblocksYjsProvider } from "@liveblocks/yjs"
import { createContext } from "react"
import type * as Y from "yjs"

export type Awareness = Pick<
    LiveblocksYjsProvider["awareness"],
    "getStates" | "setLocalStateField" | "on" | "off"
>

export interface YjsContextValue {
    ydoc: Y.Doc
    awareness: Awareness
}

export const YjsContext = createContext<YjsContextValue | null>(null)
