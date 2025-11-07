import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useCodeExecution } from "@/lib/judge0/hooks/useCodeExecution"
import { trpc } from "@/lib/trpc"
import { useAssignment } from "../context"
import EditorPane from "./components/EditorPane"
import Toolkit from "./components/Toolkit"
import { useCode } from "./hooks/useCode"
import { useCodeAutoSave } from "./hooks/useCodeAutoSave"

export default function Ide() {
    const assignment = useAssignment()
    const { isConnected } = useCodeExecution()
    const { code, setCode } = useCode(assignment)
    const navigate = useNavigate()

    useCodeAutoSave(assignment.slug, code)

    const { mutate: submitAssignment, isPending: isSubmitting } = useMutation({
        ...trpc.submission.submit.mutationOptions(),
        onSuccess: async () => {
            await navigate("/hub")
        },
        onError: () => {
            toast.error("Failed to submit assignment")
        },
    })

    const handleSubmit = () => {
        submitAssignment({
            assignmentSlug: assignment.slug,
            code: code,
        })
    }

    return (
        <div className="flex h-full flex-wrap p-10 gap-4 overflow-y-auto">
            <EditorPane
                code={code}
                onCodeChange={setCode}
                isConnected={isConnected}
            />
            <Toolkit
                code={code}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    )
}
