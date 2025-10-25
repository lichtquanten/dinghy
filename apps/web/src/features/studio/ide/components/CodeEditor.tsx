// src/components/CodeEditor.tsx
import CodeMirror from "@uiw/react-codemirror"
import { type CodeLanguageKey } from "@workspace/code-languages"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card.tsx"
import { useCodeLanguage } from "../hooks/useCodeLanguage"

interface CodeEditorProps {
    code: string
    onCodeChange: (value: string) => void
    language: CodeLanguageKey
}

export const CodeEditor = ({
    code,
    onCodeChange,
    language,
}: CodeEditorProps) => {
    const { data: languageSupport } = useCodeLanguage(language)
    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                    Code Editor
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 flex-1 overflow-auto">
                <div className="flex-1 border rounded-md overflow-hidden">
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
            </CardContent>
        </Card>
    )
}
