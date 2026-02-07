import { useState } from "react"
import { Button } from "@workspace/ui/components/button.js"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@workspace/ui/components/tabs.js"
import { useMyCode, usePartnerCode, useSharedCode } from "../../hooks/code.ts"
import { usePartner } from "../../hooks/pairing.ts"
import { useTestRunner } from "../../hooks/useTestRunner"
import { Editor } from "./Editor.tsx"

export function Collab() {
    const myCode = useMyCode()
    const partnerCode = usePartnerCode()
    const sharedCode = useSharedCode()
    const partner = usePartner()
    const { runTests } = useTestRunner()

    const [referenceTab, setReferenceTab] = useState<"yours" | "partner">(
        "yours"
    )

    return (
        <div className="flex h-full gap-4 p-4">
            {/* Reference Panel */}
            <div className="w-1/3">
                <Tabs
                    value={referenceTab}
                    onValueChange={(v) =>
                        setReferenceTab(v as "yours" | "partner")
                    }
                >
                    <TabsList className="w-full">
                        <TabsTrigger value="yours" className="flex-1">
                            Yours
                        </TabsTrigger>
                        <TabsTrigger value="partner" className="flex-1">
                            {partner?.firstName ?? "Partner"}&apos;s
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent
                        value="yours"
                        className="h-[calc(100%-40px)] mt-2"
                    >
                        <Editor ytext={myCode.ytext()} readOnly />
                    </TabsContent>
                    <TabsContent
                        value="partner"
                        className="h-[calc(100%-40px)] mt-2"
                    >
                        {partnerCode && (
                            <Editor ytext={partnerCode.ytext()} readOnly />
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Shared Editor */}
            <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-hidden">
                    <Editor
                        ytext={sharedCode.ytext()}
                        label="Shared Solution"
                    />
                </div>
                <div className="h-14 border-t px-4 flex items-center mt-4">
                    <Button onClick={runTests} variant="outline" size="sm">
                        Run Tests
                    </Button>
                </div>
            </div>
        </div>
    )
}
