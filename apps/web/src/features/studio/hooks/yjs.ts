import { useContext, useEffect, useMemo } from "react"
import { yCollab } from "y-codemirror.next"
import * as Y from "yjs"
import { useSelf } from "@/lib/hooks/useSelf"
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
    const self = useSelf()

    useEffect(() => {
        awareness.setLocalStateField("user", {
            name: self.firstName,
            color: "#888888",
            colorLight: `#88888880`,
        })
    }, [awareness, self])

    const undoManager = useMemo(() => new Y.UndoManager(ytext), [ytext])

    return useMemo(
        () => yCollab(ytext, awareness, { undoManager }),
        [ytext, awareness, undoManager]
    )
}
