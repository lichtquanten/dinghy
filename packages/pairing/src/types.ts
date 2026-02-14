import type { User } from "@workspace/db/browser"
import type { Store, TextAccessor } from "@workspace/yjs-store"

export type PairingActions = {
    initialize: (partnerIds: User["id"][]) => void
    setReady: (userId: string, ready: boolean) => void
    startPhase: (secsRemaining: number, serverNow: number) => void
    pausePhase: (secsRemaining: number) => void
    resumePhase: (serverNow: number) => void
    advancePhase: (secsRemaining: number, serverNow: number) => void
    advanceTask: () => void
    complete: () => void
}

export type PairingState = {
    taskIndex: number
    phaseIndex: number
    phaseSecsRemaining: number | null
    phaseTickingSince: number | null
    isStarted: boolean
    isPaused: boolean
    readyByUser: Record<User["id"], boolean>
    isCompleted: boolean
}

export type PairingStore = Store<PairingState, PairingActions>

export type PairingDoc = {
    store: PairingStore
    sharedCode: TextAccessor
    userCode: Record<User["id"], TextAccessor>
}
