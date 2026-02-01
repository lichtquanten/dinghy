import { useAtomValue } from "jotai"
import { currentModeAtom } from "../../atoms"
import { Collab } from "./Collab"
import { Review } from "./Review"
import { Solo } from "./Solo"

export function Workspace() {
    const currentMode = useAtomValue(currentModeAtom)

    switch (currentMode) {
        case "solo":
            return <Solo />
        case "review":
            return <Review />
        case "collaborative":
            return <Collab />
    }
}
