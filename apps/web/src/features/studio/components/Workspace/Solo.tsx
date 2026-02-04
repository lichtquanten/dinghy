import { Button } from "@workspace/ui/components/button.js"
import { useTestRunner } from "../../hooks/useTestRunner"
import { useMyCode } from "../../hooks/yjs"
import { Playground } from "../Playground"
import { Editor } from "./Editor"

export function Solo() {
    const myCode = useMyCode()

    const { runTests } = useTestRunner()

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden p-4">
                <Editor ytext={myCode} />
            </div>
            <Playground />
            <div className="h-14 border-t px-4 flex items-center gap-2">
                <Button onClick={runTests} variant="outline" size="sm">
                    Run Tests
                </Button>
            </div>
        </div>
    )
}
