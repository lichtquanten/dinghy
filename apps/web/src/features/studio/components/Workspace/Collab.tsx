import { useState } from "react"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@workspace/ui/components/tabs.js"
import { useMyCode, usePartnerCode, useSharedCode } from "../../hooks/code.ts"
import { usePartner } from "../../hooks/pairing.ts"
import { Playground } from "../Playground.tsx"
import { Editor } from "./Editor.tsx"

export function Collab() {
    const myCode = useMyCode()
    const partnerCode = usePartnerCode()
    const sharedCode = useSharedCode()
    const partner = usePartner()

    const [referenceTab, setReferenceTab] = useState<"yours" | "partner">(
        "yours"
    )

    return (
        <div className="flex h-full gap-4 p-4">
            {/* Reference Panel */}
            <div className="w-1/3 flex flex-col">
                <Tabs
                    value={referenceTab}
                    onValueChange={(v) =>
                        setReferenceTab(v as "yours" | "partner")
                    }
                    className="flex-1 min-h-0 flex flex-col"
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
                        className="flex-1 min-h-0 overflow-hidden mt-2"
                    >
                        <Editor ytext={myCode.ytext()} readOnly />
                    </TabsContent>
                    <TabsContent
                        value="partner"
                        className="flex-1 min-h-0 overflow-hidden mt-2"
                    >
                        {partnerCode && (
                            <Editor ytext={partnerCode.ytext()} readOnly />
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Shared Editor with Playground */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="h-10 px-4 flex items-center bg-muted/50 border border-border rounded-t-lg">
                    <span className="text-sm font-medium">Shared Solution</span>
                </div>
                <div className="flex-1 min-h-0 overflow-hidden mt-2">
                    <Editor ytext={sharedCode.ytext()} />
                </div>
                <Playground />
            </div>
        </div>
    )
}
