import { atom } from "jotai"
import type { RouterOutputs } from "@workspace/api"
import type { ReadyState, TaskMode } from "./types"

type Assignment = RouterOutputs["assignment"]["get"]
type Partner = NonNullable<Assignment["pairing"]>["partner"]

// ============================================================================
// Core state atoms
// ============================================================================

export const assignmentAtom = atom<Assignment | null>(null)

export const currentTaskIndexAtom = atom(0)

export const currentModeAtom = atom<TaskMode>("solo")

export const partnerAtom = atom<Partner | null>(null)

// ============================================================================
// Code state atoms
// ============================================================================

export const myCodeAtom = atom("")

export const partnerCodeAtom = atom("")

export const sharedCodeAtom = atom("")

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

export const currentTaskAtom = atom((get) => {
    const assignment = get(assignmentAtom)
    const index = get(currentTaskIndexAtom)
    return assignment?.tasks[index] ?? null
})

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

export const initializeStudioAtom = atom(
    null,
    (_get, set, assignment: Assignment) => {
        set(assignmentAtom, assignment)
        set(myCodeAtom, assignment.starterCode)
        set(partnerAtom, assignment.pairing?.partner ?? null)
        set(currentTaskIndexAtom, assignment.pairing?.currentTaskIndex ?? 0)
        set(currentModeAtom, assignment.pairing ? "collaborative" : "solo")
        set(startTimeAtom, Date.now())
    }
)
