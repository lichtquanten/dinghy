import type { RouterOutputs } from "@workspace/api"

export type TaskMode = "solo" | "review" | "collaborative"

export type ReadyState = {
    myReady: boolean
    partnerReady: boolean
    firstReadyAt: number | null // timestamp
}

export type Assignment = RouterOutputs["assignment"]["get"]
export type Task = Assignment["tasks"][number]
export type TestCase = Task["testCases"][number]
export type Partner = NonNullable<Assignment["pairing"]>["partner"]

export type StudioState = {
    assignment: Assignment
    partner: Partner
    currentTaskIndex: number
    currentMode: TaskMode
    readyState: ReadyState
}
