import type { Doc } from "yjs"

export function createTextAccessor(doc: Doc, key: string) {
    const ytext = doc.getText(key)
    return {
        ytext: () => ytext,
        toString: () => ytext.toString(),
    }
}
