import type { Doc } from "yjs"
import type { TextAccessor } from "./types"

export function createTextAccessor(doc: Doc, key: string): TextAccessor {
    const ytext = doc.getText(key)
    return {
        ytext: () => ytext,
        toString: () => ytext.toJSON(),
    }
}
