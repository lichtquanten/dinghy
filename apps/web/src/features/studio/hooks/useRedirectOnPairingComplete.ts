import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useStoreSelector } from "@workspace/pairing/react"
import { usePairingDoc } from "./usePairingDoc"

export function useRedirectOnPairingComplete() {
    const pairing = usePairingDoc()
    const isCompleted = useStoreSelector(pairing.store, (s) => s.isCompleted)

    const navigate = useNavigate()

    useEffect(() => {
        if (!isCompleted) return

        toast.success("Assignment submitted!")

        const timeout = setTimeout(() => {
            void navigate("/hub")
        }, 2000)

        return () => clearTimeout(timeout)
    }, [isCompleted, navigate])
}
