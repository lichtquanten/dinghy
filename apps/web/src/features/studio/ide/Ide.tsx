import { useCodeExecution } from "@/lib/judge0/hooks/useCodeExecution"
import { useAssignment } from "../context"
import EditorPane from "./components/EditorPane"
import Toolkit from "./components/Toolkit"
import { useCode } from "./hooks/useCode"
import { useCodeAutoSave } from "./hooks/useCodeAutoSave"

function runTests() {}

export default function Ide() {
    const assignment = useAssignment()
    const { isConnected } = useCodeExecution()
    const { code, setCode } = useCode(assignment)
    useCodeAutoSave(assignment.slug, code)

    return (
        <div className="flex h-full p-10 gap-4 overflow-hidden">
            <EditorPane
                code={code}
                onCodeChange={setCode}
                language={assignment.codeLanguage}
                filename={assignment.filename}
                isConnected={isConnected}
                runTests={runTests}
            />
            <Toolkit code={code} />
        </div>
    )
}
