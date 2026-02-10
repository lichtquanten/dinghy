import { useSuspenseQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { trpc } from "@/lib/trpc"

export function useAssignmentId() {
    const { pairingId } = useParams()
    if (!pairingId) {
        throw new Error("Missing pairingId in route")
    }
    const { data: pairing } = useSuspenseQuery(
        trpc.pairing.get.queryOptions({ id: pairingId })
    )
    if (pairing.assignmentId) {
        return pairing.assignmentId
    }
    throw new Error("Missing assignmentId in route")
}

export function useAssignment() {
    const assignmentId = useAssignmentId()
    const { data: assignment } = useSuspenseQuery(
        trpc.assignment.get.queryOptions({ id: assignmentId })
    )
    return assignment
}

export function useTasks() {
    const assignment = useAssignment()
    return assignment.tasks
}
