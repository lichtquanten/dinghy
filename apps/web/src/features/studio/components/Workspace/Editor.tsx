import { useSuspenseQuery } from "@tanstack/react-query"
import CodeMirror from "@uiw/react-codemirror"
import type * as Y from "yjs"
import { getCodemirrorLoader } from "@/lib/codemirror"
import { useAssignment } from "../../hooks/assignment"
import { useCollabExtension } from "../../hooks/yjs"

interface EditorProps {
    ytext: Y.Text
    readOnly?: boolean
    label?: string
}

export function Editor({ ytext, readOnly = false, label }: EditorProps) {
    const collabExtension = useCollabExtension(ytext)

    const { data: assignment } = useAssignment()
    const codeLanguage = assignment.codeLanguage

    const { data: languageExtension } = useSuspenseQuery({
        queryKey: ["codemirror-language", codeLanguage],
        queryFn: () => getCodemirrorLoader(codeLanguage)(),
    })
    const extensions = [collabExtension, languageExtension]

    const initialValue = ytext.toString()

    return (
        <div className="flex flex-col h-full border border-border rounded-lg overflow-hidden">
            {label && (
                <div className="h-10 px-4 flex items-center border-b bg-muted/30">
                    <span className="text-sm font-medium">{label}</span>
                </div>
            )}
            <div className="flex-1 overflow-hidden">
                <CodeMirror
                    value={initialValue}
                    extensions={extensions}
                    readOnly={readOnly}
                    editable={!readOnly}
                    height="100%"
                />
            </div>
        </div>
    )
}
