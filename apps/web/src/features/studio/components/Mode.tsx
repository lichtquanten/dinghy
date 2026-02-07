import type { InteractionMode } from "@workspace/db/browser"
import { useStoreSelector } from "@workspace/pairing"
import { Button } from "@workspace/ui/components/button.js"
import { useSelf } from "@/lib/hooks/useSelf.js"
import { useCurrentTask } from "../hooks/progress.js"
import { usePairingDoc } from "../hooks/usePairingDoc.js"

const MODE_CONFIG: Record<
    InteractionMode,
    { label: string; instruction: string }
> = {
    solo: {
        label: "SOLO",
        instruction: "Work independently on your solution",
    },
    review: {
        label: "REVIEW",
        instruction: "Compare approaches with your partner",
    },
    collaborative: {
        label: "COLLAB",
        instruction: "Build your shared solution together",
    },
}

export function Mode() {
    const pairing = usePairingDoc()
    const self = useSelf()
    const task = useCurrentTask()

    const phaseIndex = useStoreSelector(pairing.store, (s) => s.phaseIndex)
    const ready = useStoreSelector(pairing.store, (s) => s.ready)

    const currentPhase = task.phases[phaseIndex]
    const interactionMode = currentPhase?.interactionMode ?? "solo"
    const config = MODE_CONFIG[interactionMode]
    const isCollaborative = interactionMode === "collaborative"

    const myReady = ready[self.id] ?? false
    const partnerReady = Object.entries(ready).some(
        ([id, isReady]) => id !== self.id && isReady
    )

    const handleClick = () => {
        if (isCollaborative) {
            // TODO: handle submit
        } else {
            pairing.store.setReady(self.id, !myReady)
        }
    }

    const getButtonLabel = () => {
        if (isCollaborative) {
            return "Submit"
        }
        if (myReady) {
            if (partnerReady) {
                return "Both Ready"
            }
            return "Waiting..."
        }
        return "Ready"
    }

    const getStatusMessage = () => {
        if (!myReady && partnerReady) {
            return "Partner is ready!"
        }
        return null
    }

    const statusMessage = getStatusMessage()

    return (
        <div className="h-14 border-b bg-background flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <div className="font-semibold text-sm">
                    {config.label}:{" "}
                    <span className="font-normal text-muted-foreground">
                        {config.instruction}
                    </span>
                </div>
                {statusMessage && (
                    <div className="text-sm text-amber-600 dark:text-amber-500">
                        {statusMessage}
                    </div>
                )}
            </div>
            <Button
                onClick={handleClick}
                disabled={false}
                variant={myReady ? "secondary" : "default"}
                size="sm"
            >
                {getButtonLabel()}
            </Button>
        </div>
    )
}
