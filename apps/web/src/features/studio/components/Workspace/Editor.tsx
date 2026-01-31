import type { CodeLanguageKey } from "@workspace/code-languages"
import { cn } from "@workspace/ui/lib/utils.js"
import { CodeEditor } from "@/lib/components/CodeEditor"

interface EditorProps {
    value: string
    onChange?: (value: string) => void // undefined = read-only
    language: CodeLanguageKey
    className?: string
    label?: string
}

export function Editor({
    value,
    onChange,
    language,
    className,
    label,
}: EditorProps) {
    const isReadOnly = onChange === undefined

    const classes = cn(
        "flex flex-col h-full border border-border rounded-lg overflow-hidden",
        className
    )

    return (
        <div className={classes}>
            {label && (
                <div className="h-10 px-4 flex items-center border-b bg-muted/30">
                    <span className="text-sm font-medium">{label}</span>
                </div>
            )}
            <div className="flex-1 overflow-hidden">
                <CodeEditor
                    value={value}
                    onChange={onChange}
                    language={language}
                    readOnly={isReadOnly}
                />
            </div>
        </div>
    )
}
