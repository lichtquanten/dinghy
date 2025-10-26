import { type ReactNode } from "react"
import type { AssignmentPublic } from "@workspace/database"
import { AssignmentContext } from "./context.js"

interface AssignmentProviderProps {
    assignment: AssignmentPublic
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
