import * as Y from "yjs"
import type { Assignment, Pairing, User } from "@workspace/db/client"

export type Mode = "solo" | "collaborative" | "review"

export type Progress = {
    mode: Mode
    taskIndex: number
}

export const DOC_KEYS = {
    progress: "progress",
    sharedCode: "code:shared",
    userCode: (userId: User["id"]) => `code:${userId}`,
} as const

const PAIRING_PREFIX = "pairing:"

export const RoomId = {
    fromPairingId: (pairingId: string) => `${PAIRING_PREFIX}${pairingId}`,
    toPairingId: (roomId: string): string | null => {
        if (!roomId.startsWith(PAIRING_PREFIX)) return null
        return roomId.slice(PAIRING_PREFIX.length)
    },
} as const

export const DEFAULTS: Progress = {
    mode: "solo",
    taskIndex: 0,
}

export function getProgress(doc: Y.Doc) {
    const map = doc.getMap(DOC_KEYS.progress)
    return {
        get mode(): Mode {
            return (map.get("mode") as Mode) ?? DEFAULTS.mode
        },
        set mode(v: Mode) {
            map.set("mode", v)
        },
        get taskIndex(): number {
            return (map.get("taskIndex") as number) ?? DEFAULTS.taskIndex
        },
        set taskIndex(v: number) {
            map.set("taskIndex", v)
        },
        observe: (fn: () => void) => map.observe(fn),
        unobserve: (fn: () => void) => map.unobserve(fn),
    }
}

export function getSharedCode(doc: Y.Doc) {
    return doc.getText(DOC_KEYS.sharedCode)
}

export function getUserCode(doc: Y.Doc, userId: User["id"]) {
    return doc.getText(DOC_KEYS.userCode(userId))
}

export function createPairingDoc(
    partnerIds: Pairing["partnerIds"],
    starterCode: Assignment["starterCode"]
) {
    const doc = new Y.Doc()

    const progress = getProgress(doc)
    progress.mode = DEFAULTS.mode
    progress.taskIndex = DEFAULTS.taskIndex

    getSharedCode(doc).insert(0, starterCode)

    for (const partnerId of partnerIds) {
        getUserCode(doc, partnerId).insert(0, starterCode)
    }

    return doc
}
