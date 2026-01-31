import { createContext, useContext } from "react"
import type { StudioState, Task, TaskMode } from "../types"

export interface StudioContextValue extends StudioState {
    clickReady: () => void
    clickSubmit: () => void
    runTests: () => void
    setMode: (mode: TaskMode) => void
    myCode: string
    partnerCode: string
    sharedCode: string
    setMyCode: (code: string) => void
    setSharedCode: (code: string) => void
    canClickReady: boolean
    timeUntilReady: number | null
    timeoutRemaining: number | null
    currentTask: Task
}

export const StudioContext = createContext<StudioContextValue | null>(null)

export function useStudio(): StudioContextValue {
    const context = useContext(StudioContext)
    if (!context) {
        throw new Error("useStudio must be used within StudioProvider")
    }
    return context
}
