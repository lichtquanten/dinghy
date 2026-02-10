import { useMyCode, useSharedCode } from "./code"
import { useCurrentInteractionMode } from "./progress"

export function useExecutableCode(): string | null {
    const mode = useCurrentInteractionMode()
    const myCode = useMyCode()
    const sharedCode = useSharedCode()

    switch (mode) {
        case "solo":
            return myCode.toString()
        case "collaborative":
            return sharedCode.toString()
        case "review":
            return null
        default: {
            mode satisfies never
            throw new Error(`Unknown interaction mode`)
        }
    }
}
