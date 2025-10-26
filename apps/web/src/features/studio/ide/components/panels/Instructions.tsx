import ReactMarkdown from "react-markdown"
import { useAssignment } from "@/features/studio/context"

export default function Instructions() {
    const assignment = useAssignment()

    return (
        <div className="m-3">
            <ReactMarkdown>{assignment.instructions}</ReactMarkdown>
        </div>
    )
}
