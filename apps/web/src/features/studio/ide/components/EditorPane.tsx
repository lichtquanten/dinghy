// components/EditorPane.tsx
import CodeMirror from "@uiw/react-codemirror"
import { FileText } from "lucide-react"
import { useAssignment } from "../../context"
import { useCodeLanguage } from "../hooks/useCodeLanguage"

interface EditorPaneProps {
    code: string
    onCodeChange: (value: string) => void
    isConnected: boolean
    isRunning?: boolean
}

export default function EditorPane({ code, onCodeChange }: EditorPaneProps) {
    const assignment = useAssignment()
    const { data: languageSupport } = useCodeLanguage(assignment.codeLanguage)

    return (
        <div className="flex flex-col flex-[2] border-r">
            {/* Header */}
            <div className="h-11 border-b flex items-center justify-between px-4 bg-slate-50">
                <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">
                        {assignment.filename}
                    </span>
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-hidden">
                <CodeMirror
                    value={code}
                    height="100%"
                    extensions={languageSupport ? [languageSupport] : []}
                    onChange={onCodeChange}
                    className="h-full text-base"
                    basicSetup={{
                        lineNumbers: true,
                        highlightActiveLineGutter: true,
                        highlightActiveLine: true,
                        foldGutter: true,
                    }}
                />
            </div>
        </div>
    )
}
