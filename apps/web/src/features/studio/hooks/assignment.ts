import { useSuspenseQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { trpc } from "@/lib/trpc"

export function useAssignmentId() {
    const { assignmentId } = useParams()
    if (!assignmentId) {
        throw new Error("Missing assignmentId in route")
    }
    return assignmentId
}

export function useAssignment() {
    const assignmentId = useAssignmentId()
    return useSuspenseQuery(
        trpc.assignment.get.queryOptions({ id: assignmentId })
    )
}

export function usePartner() {
    const { data } = useAssignment()
    return data.pairing?.partner ?? null
}

export function useTasks() {
    const { data } = useAssignment()
    return data.tasks
}

export function useCurrentTask() {
    const { data } = useAssignment()

    if (data.pairing?.currentTaskIndex == null) {
        return null
    }

    return data.tasks[data.pairing.currentTaskIndex] ?? null
}
