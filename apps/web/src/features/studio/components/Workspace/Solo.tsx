import { useAtom, useAtomValue } from "jotai"
import { Button } from "@workspace/ui/components/button.js"
import { assignmentAtom, myCodeAtom } from "../../atoms"
import { useTestRunner } from "../../hooks/useTestRunner"
import { Playground } from "../Playground"
import { Editor } from "./Editor"

export function Solo() {
    const assignment = useAtomValue(assignmentAtom)
    const [myCode, setMyCode] = useAtom(myCodeAtom)
    const { runTests } = useTestRunner()

    if (!assignment) return null

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden p-4">
                <Editor
                    value={myCode}
                    onChange={setMyCode}
                    language={assignment.codeLanguage}
                />
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
