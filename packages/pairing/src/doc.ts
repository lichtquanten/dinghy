// doc.ts

import type { Doc } from "yjs"
import type { User } from "@workspace/db/browser"
import { createTextAccessor, type TextAccessor } from "@workspace/yjs-store"
import { createPairingStore } from "./store"
import type { PairingDoc } from "./types"

const KEYS = {
    sharedCode: "code:shared",
    userCode: (userId: User["id"]) => `code:${userId}`,
} as const

export function getPairingDoc(ydoc: Doc, partnerIds: string[]): PairingDoc {
    return {
        store: createPairingStore(ydoc),
        sharedCode: createTextAccessor(ydoc, KEYS.sharedCode),
        userCode: Object.fromEntries(
            partnerIds.map((id) => [
                id,
                createTextAccessor(ydoc, KEYS.userCode(id)),
            ])
        ) as Record<User["id"], TextAccessor>,
    }
}
