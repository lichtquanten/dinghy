import type { Doc } from "yjs"
import { createTextAccessor } from "@workspace/yjs-store"
import { createPairingStore } from "./store"

const KEYS = {
    sharedCode: "code:shared",
    userCode: (userId: string) => `code:${userId}`,
} as const

export function getPairingDoc(ydoc: Doc, partnerIds: string[]) {
    return {
        store: createPairingStore(ydoc),
        sharedCode: createTextAccessor(ydoc, KEYS.sharedCode),
        userCode: Object.fromEntries(
            partnerIds.map((id) => [
                id,
                createTextAccessor(ydoc, KEYS.userCode(id)),
            ])
        ) as Record<string, ReturnType<typeof createTextAccessor>>,
    }
}
