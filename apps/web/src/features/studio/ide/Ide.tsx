import { useState } from "react"
import { useCodeExecution } from "@/lib/judge0/hooks/useCodeExecution"
import { useAssignment } from "../context"
import EditorPane from "./components/EditorPane"
import Toolkit from "./components/Toolkit"
import { useCode } from "./hooks/useCode"
import { useCodeAutoSave } from "./hooks/useCodeAutoSave"

export default function Ide() {
    const assignment = useAssignment()
    const { isConnected } = useCodeExecution()
    const { code, setCode } = useCode(assignment)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    useCodeAutoSave(assignment.slug, code)

    const handleSubmit = () => {
        setIsSubmitting(true)
        console.log("Submit", assignment, code)
        // await submission
        setIsSubmitting(false)
        // redirect to assignments page
    }

    return (
        <div className="flex h-full flex-col md:flex-row p-10 gap-4 overflow-y-auto md:overflow-hidden">
            <EditorPane
                code={code}
                onCodeChange={setCode}
                isConnected={isConnected}
            />
            <div className="flex flex-col flex-1 relative">
                <Toolkit code={code} />
                <div className="absolute bottom-0 right-0">
                    <button onClick={handleSubmit} disabled={isSubmitting}>
                        Submit Assignment
                    </button>
                </div>
            </div>
        </div>
    )
}
