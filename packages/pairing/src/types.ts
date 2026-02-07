import type { User } from "@workspace/db/browser"

export type PairingState = {
    taskIndex: number
    phaseIndex: number
    phaseStartedAt: number
    firstReadyAt: number | null
    driver: User["id"] | null
    ready: Record<User["id"], boolean>
}
