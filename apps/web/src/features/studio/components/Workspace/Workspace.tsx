import { useCurrentInteractionMode } from "../../hooks/progress"
import { Collab } from "./Collab"
import { Review } from "./Review"
import { Solo } from "./Solo"

export function Workspace() {
    const currentMode = useCurrentInteractionMode()

    return (
        <div className="flex-1 overflow-hidden">
            {currentMode === "solo" && <Solo />}
            {currentMode === "review" && <Review />}
            {currentMode === "collaborative" && <Collab />}
        </div>
    )
}
