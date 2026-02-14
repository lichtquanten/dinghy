import type { InteractionMode } from "@workspace/db/browser"
import { Button } from "@workspace/ui/components/button.js"
import { useCurrentPhase } from "../hooks/progress.js"
import { type PhaseStatus, usePhaseStatus } from "../hooks/usePhaseStatus.js"
import { useSelfReady } from "../hooks/useSelfReady.js"

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

const BUTTON_CONFIG: Record<
    PhaseStatus["status"],
    { label: string; disabled: boolean; variant: "default" | "secondary" }
> = {
    locked: { label: "Wait", disabled: true, variant: "default" },
    unlocked: { label: "I'm done", disabled: false, variant: "default" },
    partnerWaiting: { label: "I'm done", disabled: false, variant: "default" },
    waiting: {
        label: "Waiting for partner...",
        disabled: true,
        variant: "secondary",
    },
    advancing: { label: "Advancing...", disabled: true, variant: "secondary" },
    paused: {
        label: "Activity paused...",
        disabled: true,
        variant: "default",
    },
}

function formatTime(seconds: number) {
    const total = Math.ceil(seconds)
    const m = Math.floor(total / 60)
    const s = total % 60
    return m > 0 ? `${m}:${s.toString().padStart(2, "0")}` : `${s}s`
}

function StatusMessage({ state }: { state: PhaseStatus }) {
    switch (state.status) {
        case "locked":
            return (
                <span className="text-sm text-muted-foreground">
                    {formatTime(state.secsRemaining)} until you can continue
                </span>
            )
        case "partnerWaiting":
            return (
                <span className="text-sm text-amber-600 dark:text-amber-500">
                    {state.secsRemaining == null
                        ? "Partner is ready"
                        : `Partner is ready. Auto-advancing in ${formatTime(state.secsRemaining)}`}
                </span>
            )
        case "waiting":
            return (
                <span className="text-sm text-muted-foreground">
                    {state.secsRemaining !== null
                        ? `Auto-advancing in ${formatTime(state.secsRemaining)}`
                        : "Waiting for partner..."}
                </span>
            )
        case "advancing":
            return null
        case "unlocked":
            return null
    }
}

function PhaseActions() {
    const state = usePhaseStatus()
    const { setSelfReady } = useSelfReady()
    const button = BUTTON_CONFIG[state.status]

    return (
        <div className="flex items-center gap-3">
            <StatusMessage state={state} />
            <Button
                onClick={() => setSelfReady(true)}
                disabled={button.disabled}
                variant={button.variant}
                size="sm"
            >
                {button.label}
            </Button>
        </div>
    )
}

export function Mode() {
    const phase = useCurrentPhase()
    const interactionMode = phase?.interactionMode ?? "solo"
    const config = MODE_CONFIG[interactionMode]

    return (
        <div className="h-14 border-b bg-background flex items-center justify-between px-6">
            <div className="font-semibold text-sm">
                {config.label}:{" "}
                <span className="font-normal text-muted-foreground">
                    {config.instruction}
                </span>
            </div>
            <PhaseActions />
        </div>
    )
}
