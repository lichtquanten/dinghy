import { createContext, useContext } from "react"
import type { RouterOutputs } from "@workspace/api"

export const AssignmentContext = createContext<
    RouterOutputs["assignment"]["get"] | null
>(null)

export function useAssignment() {
    const assignment = useContext(AssignmentContext)
    if (!assignment) {
        throw new Error("useAssignment must be used within AssignmentProvider")
    }
    return assignment
}
