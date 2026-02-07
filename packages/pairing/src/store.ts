import { createStoreFactory } from "@workspace/yjs-store"
import type { PairingState } from "./types"

export const createPairingStore = createStoreFactory(
    "pairing",
    (update: (fn: (draft: PairingState) => void) => void) => ({
        initialize: () =>
            update((d) => {
                d.taskIndex = 0
                d.phaseIndex = 0
                d.phaseStartedAt = 0
                d.firstReadyAt = null
                d.driver = null
                d.ready = {}
            }),

        setReady: (userId: string, ready: boolean) =>
            update((d) => {
                d.ready[userId] = ready
                if (ready && !d.firstReadyAt) {
                    d.firstReadyAt = Date.now()
                }
                if (!ready && !Object.values(d.ready).some(Boolean)) {
                    d.firstReadyAt = null
                }
            }),

        advancePhase: () =>
            update((d) => {
                d.phaseIndex++
                d.phaseStartedAt = Date.now()
                d.firstReadyAt = null
                d.ready = {}
            }),

        setDriver: (driverId: string) =>
            update((d) => {
                d.driver = driverId
            }),

        advanceTask: () =>
            update((d) => {
                d.taskIndex++
                d.phaseIndex = 0
                d.phaseStartedAt = 0
                d.firstReadyAt = null
                d.driver = null
                d.ready = {}
            }),
    })
)
