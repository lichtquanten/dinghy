import type { User } from "@workspace/db/browser"
import type { Store, TextAccessor } from "@workspace/yjs-store"

export type PairingActions = {
    initialize: (partnerIds: User["id"][]) => void
    setReady: (userId: string, ready: boolean) => void
    advancePhase: () => void
    setDriver: (driverId: string) => void
    advanceTask: () => void
}

export type PairingState = {
    taskIndex: number
    phaseIndex: number
    phaseStartedAt: number
    firstReadyAt: number | null
    driver: User["id"] | null
    ready: Record<User["id"], boolean>
}

export type PairingStore = Store<PairingState, PairingActions>

export type PairingDoc = {
    store: PairingStore
    sharedCode: TextAccessor
    userCode: Record<User["id"], TextAccessor>
}
