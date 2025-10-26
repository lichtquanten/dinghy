// components/EditorPane.tsx
import CodeMirror from "@uiw/react-codemirror"
import { FileText, Play } from "lucide-react"
import { type CodeLanguageKey } from "@workspace/code-languages"
import { Button } from "@workspace/ui/components/button.tsx"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@workspace/ui/components/tooltip.tsx"
import { useCodeLanguage } from "../hooks/useCodeLanguage"

interface EditorPaneProps {
    code: string
    onCodeChange: (value: string) => void
    language: CodeLanguageKey
    filename: string
    runTests: () => void
    isConnected: boolean
    isRunning?: boolean
}

export default function EditorPane({
    code,
    onCodeChange,
    language,
    filename,
}: EditorPaneProps) {
    const { data: languageSupport } = useCodeLanguage(language)

    return (
        <div className="flex flex-col flex-[2] border-r">
            {/* Header */}
            <div className="h-11 border-b flex items-center justify-between px-4 bg-slate-50">
                <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">
                        {filename}
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
