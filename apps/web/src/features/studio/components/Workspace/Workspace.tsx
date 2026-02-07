import { useCurrentInteractionMode } from "../../hooks/progress"
import { Collab } from "./Collab"
import { Review } from "./Review"
import { Solo } from "./Solo"

export function Workspace() {
    const currentMode = useCurrentInteractionMode()

    switch (currentMode) {
        case "solo":
            return <Solo />
        case "review":
            return <Review />
        case "collaborative":
            return <Collab />
    }
}
