import { useStudio } from "../../hooks/StudioContext"
import { Editor } from "./Editor"

export function ReviewWorkspace() {
    const { myCode, partnerCode, partner } = useStudio()

    return (
        <div className="flex h-full gap-4 p-4">
            <div className="flex-1">
                <Editor value={myCode} language="python" label="Yours" />
            </div>
            <div className="flex-1">
                <Editor
                    value={partnerCode}
                    language="python"
                    label={partner ? `${partner.firstName}'s` : "Partner's"}
                />
            </div>
        </div>
    )
}
