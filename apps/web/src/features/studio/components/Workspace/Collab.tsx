import { useAtom, useAtomValue } from "jotai"
import { useState } from "react"
import { Button } from "@workspace/ui/components/button.js"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@workspace/ui/components/tabs.js"
import {
    assignmentAtom,
    myCodeAtom,
    partnerAtom,
    partnerCodeAtom,
    sharedCodeAtom,
} from "../../atoms"
import { useTestRunner } from "../../hooks/useTestRunner"
import { Editor } from "./Editor"

export function Collab() {
    const assignment = useAtomValue(assignmentAtom)
    const myCode = useAtomValue(myCodeAtom)
    const partnerCode = useAtomValue(partnerCodeAtom)
    const partner = useAtomValue(partnerAtom)
    const [sharedCode, setSharedCode] = useAtom(sharedCodeAtom)
    const { runTests } = useTestRunner()
    const [referenceTab, setReferenceTab] = useState<"yours" | "partner">(
        "yours"
    )

    if (!assignment) return null

    return (
        <div className="flex h-full gap-4 p-4">
            {/* Reference Panel - 1/3 */}
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
                            {partner ? `${partner.firstName}'s` : "Partner's"}
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent
                        value="yours"
                        className="h-[calc(100%-40px)] mt-2"
                    >
                        <Editor
                            value={myCode}
                            language={assignment.codeLanguage}
                        />
                    </TabsContent>
                    <TabsContent
                        value="partner"
                        className="h-[calc(100%-40px)] mt-2"
                    >
                        <Editor
                            value={partnerCode}
                            language={assignment.codeLanguage}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Shared Editor - 2/3 */}
            <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-hidden">
                    <Editor
                        value={sharedCode}
                        onChange={setSharedCode}
                        language={assignment.codeLanguage}
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
