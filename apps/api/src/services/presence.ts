import { PairingRoomId } from "@workspace/pairing"
import { computeSecsRemaining, withPairingStore } from "./pairing.js"

const pendingPauseTimers = new Map<string, NodeJS.Timeout>()

export function handleUserLeft(roomId: string, numActiveUsers: number) {
    if (numActiveUsers >= 2) return
    if (pendingPauseTimers.has(roomId)) return

    const pairingId = PairingRoomId.parse(roomId)
    if (!pairingId) return

    const timer = setTimeout(() => {
        pendingPauseTimers.delete(roomId)

        void withPairingStore(roomId, (store, state) => {
            if (state.isPaused || state.isCompleted) return false
            if (state.phaseTickingSince == null) return false

            store.pausePhase(computeSecsRemaining(state))
        }).catch((err) => {
            console.error(`Failed to pause room ${roomId}:`, err)
        })
    }, 15_000)

    pendingPauseTimers.set(roomId, timer)
}

export function handleUserEntered(roomId: string, numActiveUsers: number) {
    if (numActiveUsers < 2) return

    const timer = pendingPauseTimers.get(roomId)
    if (timer) {
        clearTimeout(timer)
        pendingPauseTimers.delete(roomId)
    }
}
