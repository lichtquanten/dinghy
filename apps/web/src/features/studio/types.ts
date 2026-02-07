import type { RouterOutputs } from "@workspace/api"

export type Assignment = RouterOutputs["assignment"]["get"]
export type Task = Assignment["tasks"][number]
export type TestCase = Task["testCases"][number]
export type Partner = NonNullable<Assignment["pairing"]>["partner"]

export type PairingState = {
    taskIndex: number
    phaseIndex: number
    phaseStartedAt: number
    firstReadyAt: number | null
    driver: string | null
    ready: Record<string, boolean>
}

export const initialPairingState: PairingState = {
    taskIndex: 0,
    phaseIndex: 0,
    phaseStartedAt: 0,
    firstReadyAt: null,
    driver: null,
    ready: {},
}
