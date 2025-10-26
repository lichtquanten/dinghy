import { createContext, useContext } from "react"
import type { AssignmentPublic } from "@workspace/database"

export const AssignmentContext = createContext<AssignmentPublic | null>(null)

export function useAssignment() {
    const assignment = useContext(AssignmentContext)
    if (!assignment) {
        throw new Error("useAssignment must be used within AssignmentProvider")
    }
    return assignment
}
