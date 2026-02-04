import { atom } from "jotai"
import type { ReadyState, TaskMode } from "./types"

// ============================================================================
// Core state atoms
// ============================================================================

export const currentModeAtom = atom<TaskMode>("solo")
// ============================================================================
// Timer atoms
// ============================================================================

export const startTimeAtom = atom<number>(Date.now())

export const timeElapsedAtom = atom(0)

// ============================================================================
// Ready state atoms
// ============================================================================

export const myReadyAtom = atom(false)

export const partnerReadyAtom = atom(false)

export const firstReadyAtAtom = atom<number | null>(null)

// ============================================================================
// Derived atoms
// ============================================================================

export const readyStateAtom = atom<ReadyState>((get) => ({
    myReady: get(myReadyAtom),
    partnerReady: get(partnerReadyAtom),
    firstReadyAt: get(firstReadyAtAtom),
}))

export const canClickReadyAtom = atom((get) => {
    const mode = get(currentModeAtom)
    const timeElapsed = get(timeElapsedAtom)
    const minTimeSecs = 120
    return mode === "solo" ? timeElapsed >= minTimeSecs : true
})

export const timeUntilReadyAtom = atom((get) => {
    const mode = get(currentModeAtom)
    const timeElapsed = get(timeElapsedAtom)
    const minTimeSecs = 120
    if (mode === "solo" && timeElapsed < minTimeSecs) {
        return minTimeSecs - timeElapsed
    }
    return null
})

export const timeoutRemainingAtom = atom<number | null>(null)

// ============================================================================
// Action atoms
// ============================================================================

export const clickReadyAtom = atom(null, (get, set) => {
    if (!get(canClickReadyAtom)) return

    const wasReady = get(myReadyAtom)
    const newReady = !wasReady

    set(myReadyAtom, newReady)

    if (newReady && !get(firstReadyAtAtom)) {
        set(firstReadyAtAtom, Date.now())
    }
})

export const clickSubmitAtom = atom(null, (_get, _set) => {
    console.log("Submitting solution...")
    // TODO: Implement submission logic
})

export const setModeAtom = atom(null, (_, set, mode: TaskMode) => {
    set(currentModeAtom, mode)
    set(myReadyAtom, false)
    set(partnerReadyAtom, false)
    set(firstReadyAtAtom, null)
})
