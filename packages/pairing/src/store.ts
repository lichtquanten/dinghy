import type { User } from "@workspace/db/browser"
import { createStoreFactory } from "@workspace/yjs-store"
import type { PairingState } from "./types"

export const createPairingStore = createStoreFactory(
    "pairing",
    (update: (fn: (draft: PairingState) => void) => void) => ({
        initialize: (partnerIds: User["id"][]) =>
            update((d) => {
                d.taskIndex = 0
                d.phaseIndex = 0
                d.phaseSecsRemaining = null
                d.phaseTickingSince = null
                d.isStarted = false
                d.isPaused = false
                d.isCompleted = false
                d.readyByUser = Object.fromEntries(
                    partnerIds.map((id) => [id, false])
                )
            }),

        setReady: (userId: string, ready: boolean) =>
            update((d) => {
                d.readyByUser[userId] = ready
            }),

        startPhase: (secsRemaining: number, serverNow: number) =>
            update((d) => {
                d.phaseSecsRemaining = secsRemaining
                d.phaseTickingSince = serverNow
                d.isStarted = true
                d.isPaused = false
                for (const id of Object.keys(d.readyByUser)) {
                    d.readyByUser[id] = false
                }
            }),

        pausePhase: (secsRemaining: number) =>
            update((d) => {
                d.phaseSecsRemaining = secsRemaining
                d.phaseTickingSince = null
                d.isPaused = true
            }),

        resumePhase: (serverNow: number) =>
            update((d) => {
                d.phaseTickingSince = serverNow
                d.isPaused = false
                for (const id of Object.keys(d.readyByUser)) {
                    d.readyByUser[id] = false
                }
            }),

        advancePhase: (secsRemaining: number, serverNow: number) =>
            update((d) => {
                d.phaseIndex++
                d.phaseSecsRemaining = secsRemaining
                d.phaseTickingSince = serverNow
                d.isPaused = false
                for (const id of Object.keys(d.readyByUser)) {
                    d.readyByUser[id] = false
                }
            }),

        advanceTask: () =>
            update((d) => {
                d.taskIndex++
                d.phaseIndex = 0
                d.phaseSecsRemaining = null
                d.phaseTickingSince = null
                d.isPaused = false
                for (const id of Object.keys(d.readyByUser)) {
                    d.readyByUser[id] = false
                }
            }),

        complete: () =>
            update((d) => {
                d.isCompleted = true
                d.phaseTickingSince = null
            }),
    })
)
