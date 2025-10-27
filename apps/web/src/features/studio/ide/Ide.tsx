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
    useCodeAutoSave(assignment.slug, code)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const handleSubmit = () => {
        setIsSubmitting(true)
        console.log("Submit", assignment, code)
        // await submission
        setIsSubmitting(false)
        // redirect to assignments page
    }

    return (
        <div className="flex h-full p-10 gap-4 overflow-hidden">
            <EditorPane
                code={code}
                onCodeChange={setCode}
                isConnected={isConnected}
            />
            <div className="flex flex-col">
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
