import { Button } from "@workspace/ui/components/button.js"
import { useMyCode, usePartnerCode } from "../../hooks/code.ts"
import { usePartner } from "../../hooks/pairing.ts"
import { useTestRunner } from "../../hooks/useTestRunner"
import { Editor } from "./Editor.tsx"

export function Review() {
    const myCode = useMyCode()
    const partnerCode = usePartnerCode()
    const partner = usePartner()
    const { runTests } = useTestRunner()

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-row w-full">
                <div className="flex-1 overflow-hidden p-4">
                    <Editor ytext={myCode.ytext()} readOnly label="My Code" />
                </div>
                {partnerCode && (
                    <div className="flex-1 overflow-hidden p-4">
                        <Editor
                            ytext={partnerCode.ytext()}
                            readOnly
                            label={`${partner?.firstName ?? "Partner"}'s code`}
                        />
                    </div>
                )}
            </div>
            <div className="h-14 border-t px-4 flex items-center gap-2">
                <Button onClick={runTests} variant="outline" size="sm">
                    Run Tests
                </Button>
            </div>
        </div>
    )
}
