import { useStudio } from "../../hooks/StudioContext"
import { CollabWorkspace } from "./CollabWorkspace"
import { ReviewWorkspace } from "./ReviewWorkspace"
import { SoloWorkspace } from "./SoloWorkspace"

export function Workspace() {
    const { currentMode } = useStudio()

    switch (currentMode) {
        case "solo":
            return <SoloWorkspace />
        case "review":
            return <ReviewWorkspace />
        case "collaborative":
            return <CollabWorkspace />
    }
}
