import { useMyCode, usePartnerCode } from "../../hooks/code.ts"
import { usePartner } from "../../hooks/pairing.ts"
import { Editor } from "./Editor.tsx"

export function Review() {
    const myCode = useMyCode()
    const partnerCode = usePartnerCode()
    const partner = usePartner()

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-row flex-1 w-full overflow-hidden gap-4 p-4">
                <div className="flex-1 overflow-hidden">
                    <Editor ytext={myCode.ytext()} readOnly label="My Code" />
                </div>
                {partnerCode && (
                    <div className="flex-1 overflow-hidden">
                        <Editor
                            ytext={partnerCode.ytext()}
                            readOnly
                            label={`${partner?.firstName ?? "Partner"}'s code`}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
