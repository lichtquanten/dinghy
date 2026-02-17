import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"
import { useStoreSelector } from "@workspace/pairing/react"
import { trpc } from "@/lib/trpc"
import { usePairingId } from "./pairing"
import { useAllReady } from "./useAllReady"
import { usePairingDoc } from "./usePairingDoc"
import { usePhaseSecsRemaining } from "./usePhaseSecsRemaining"

export function useAutoAdvancePhase() {
    const pairingId = usePairingId()
    const pairing = usePairingDoc()
    const secsRemaining = usePhaseSecsRemaining()
    const taskIndex = useStoreSelector(pairing.store, (s) => s.taskIndex)
    const phaseIndex = useStoreSelector(pairing.store, (s) => s.phaseIndex)

    const { mutate } = useMutation(trpc.pairing.advancePhase.mutationOptions())

    useAllReady(() => {
        mutate({ pairingId, taskIndex, phaseIndex })
    })

    useEffect(() => {
        if (secsRemaining === null) return
        if (secsRemaining <= 0) {
            mutate({ pairingId, taskIndex, phaseIndex })
        }
    }, [secsRemaining, pairingId, taskIndex, phaseIndex, mutate])
}
