import { type ReactNode } from "react"
import type { RouterOutputs } from "@workspace/api"
import { AssignmentContext } from "./context.js"

interface AssignmentProviderProps {
    assignment: RouterOutputs["assignment"]["get"]
    children: ReactNode
}

export function AssignmentProvider({
    assignment,
    children,
}: AssignmentProviderProps) {
    return (
        <AssignmentContext.Provider value={assignment}>
            {children}
        </AssignmentContext.Provider>
    )
}
