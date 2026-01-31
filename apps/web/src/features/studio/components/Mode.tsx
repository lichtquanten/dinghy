import { Button } from "@workspace/ui/components/button.js"
import { useStudio } from "../hooks/StudioContext"
import type { TaskMode } from "../types"

const MODE_CONFIG: Record<TaskMode, { label: string; instruction: string }> = {
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

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function Mode() {
    const {
        currentMode,
        readyState,
        canClickReady,
        timeUntilReady,
        timeoutRemaining,
        clickReady,
        clickSubmit,
    } = useStudio()

    const config = MODE_CONFIG[currentMode]
    const isCollaborative = currentMode === "collaborative"

    const getButtonLabel = () => {
        if (isCollaborative) {
            return "Submit"
        }

        if (readyState.myReady) {
            if (readyState.partnerReady) {
                return "Both Ready"
            }
            return `Waiting ${timeoutRemaining !== null ? formatTime(timeoutRemaining) : ""}`
        }

        if (timeUntilReady !== null) {
            return `Ready ${formatTime(timeUntilReady)}`
        }

        return "Ready"
    }

    const getStatusMessage = () => {
        if (
            readyState.myReady &&
            !readyState.partnerReady &&
            timeoutRemaining !== null
        ) {
            return `Partner hasn't clicked ready. Auto-advancing in ${formatTime(timeoutRemaining)}`
        }

        if (!readyState.myReady && readyState.partnerReady) {
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
                onClick={isCollaborative ? clickSubmit : clickReady}
                disabled={!isCollaborative && !canClickReady}
                variant={readyState.myReady ? "secondary" : "default"}
                size="sm"
            >
                {getButtonLabel()}
            </Button>
        </div>
    )
}
