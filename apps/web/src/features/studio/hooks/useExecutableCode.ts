import { InteractionMode } from "@workspace/db/browser"
import { useMyCode, useSharedCode } from "./code"
import { useCurrentInteractionMode } from "./progress"

export function useExecutableCode(): string | null {
    const mode = useCurrentInteractionMode()
    const myCode = useMyCode()
    const sharedCode = useSharedCode()

    switch (mode) {
        case InteractionMode.solo:
            return myCode.toString()
        case InteractionMode.collaborative:
            return sharedCode.toString()
        case InteractionMode.review:
            return null
        default: {
            mode satisfies never
            throw new Error(`Unknown interaction mode`)
        }
    }
}
