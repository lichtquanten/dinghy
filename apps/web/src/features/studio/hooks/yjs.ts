import { useContext, useMemo } from "react"
import { yCollab } from "y-codemirror.next"
import * as Y from "yjs"
import { YjsContext } from "../contexts/YjsContext"

export function useYDoc() {
    const ctx = useContext(YjsContext)
    if (!ctx) throw new Error("useYDoc must be used within YjsProvider")
    return ctx.ydoc
}

export function useAwareness() {
    const ctx = useContext(YjsContext)
    if (!ctx) throw new Error("useAwareness must be used within YjsProvider")
    return ctx.awareness
}

export function useCollabExtension(ytext: Y.Text) {
    const awareness = useAwareness()

    const undoManager = useMemo(() => new Y.UndoManager(ytext), [ytext])

    return useMemo(
        () => yCollab(ytext, awareness, { undoManager }),
        [ytext, awareness, undoManager]
    )
}
