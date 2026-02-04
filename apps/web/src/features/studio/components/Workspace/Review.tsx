import { Button } from "@workspace/ui/components/button.js"
import { useTestRunner } from "../../hooks/useTestRunner"
import { useSharedCode } from "../../hooks/yjs"
import { Editor } from "./Editor.tsx"

export function Review() {
    const sharedCode = useSharedCode()
    const { runTests } = useTestRunner()

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden p-4">
                <Editor ytext={sharedCode} readOnly label="Final Solution" />
            </div>
            <div className="h-14 border-t px-4 flex items-center gap-2">
                <Button onClick={runTests} variant="outline" size="sm">
                    Run Tests
                </Button>
            </div>
        </div>
    )
}
