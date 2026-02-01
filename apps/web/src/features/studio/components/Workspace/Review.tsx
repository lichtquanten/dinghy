import { useAtomValue } from "jotai"
import { myCodeAtom, partnerAtom, partnerCodeAtom } from "../../atoms"
import { Editor } from "./Editor"

export function Review() {
    const myCode = useAtomValue(myCodeAtom)
    const partnerCode = useAtomValue(partnerCodeAtom)
    const partner = useAtomValue(partnerAtom)

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
