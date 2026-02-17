import { useStoreSelector } from "@workspace/pairing/react"
import { useAssignment } from "./assignment"
import { usePairingDoc } from "./usePairingDoc"

export function useCurrentTask() {
    const pairing = usePairingDoc()
    const assignment = useAssignment()
    const taskIndex = useStoreSelector(pairing.store, (s) => s.taskIndex)

    const tasks = assignment.tasks.sort((a, b) => a.order - b.order)
    const task = tasks[taskIndex]

    if (!task) throw new Error(`No task at index ${taskIndex}`)

    return task
}

export function useCurrentTaskIndex() {
    const pairing = usePairingDoc()
    return useStoreSelector(pairing.store, (s) => s.taskIndex)
}

export function useCurrentPhase() {
    const pairing = usePairingDoc()
    const task = useCurrentTask()
    const phaseIndex = useStoreSelector(pairing.store, (s) => s.phaseIndex)

    const phases = task.phases.sort((a, b) => a.order - b.order)
    const phase = phases[phaseIndex]

    if (!phase) throw new Error(`No phase at index ${phaseIndex}`)

    return phase
}

export function useCurrentInteractionMode() {
    const phase = useCurrentPhase()
    return phase.interactionMode
}
