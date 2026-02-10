import { useSuspenseQuery } from "@tanstack/react-query"
import CodeMirror, { EditorView, scrollPastEnd } from "@uiw/react-codemirror"
import { useMemo } from "react"
import type * as Y from "yjs"
import { getCodemirrorLoader } from "@/lib/codemirror"
import { useAssignment } from "../../hooks/assignment"
import { useCollabExtension } from "../../hooks/yjs"

const readOnlySetup = {
    foldGutter: false,
    lineNumbers: true,
    highlightActiveLine: false,
    highlightActiveLineGutter: false,
    dropCursor: false,
    crosshairCursor: false,
    highlightSelectionMatches: false,
}

const editableSetup = {
    foldGutter: false,
    lineNumbers: true,
    highlightActiveLine: true,
    highlightActiveLineGutter: true,
    dropCursor: true,
    crosshairCursor: true,
    highlightSelectionMatches: true,
}

const readOnlyTheme = EditorView.theme({
    "&": {
        backgroundColor: "#f9fafb",
    },
    ".cm-gutters": {
        backgroundColor: "#f9fafb",
        color: "#d1d5db",
    },
    ".cm-activeLineGutter": {
        backgroundColor: "transparent",
    },
    ".cm-content": {
        caretColor: "transparent",
    },
    ".cm-cursor": {
        display: "none",
    },
    "&.cm-focused": {
        outline: "none",
    },
})

interface EditorProps {
    ytext: Y.Text
    readOnly?: boolean
    label?: string
}

export function Editor({ ytext, readOnly = false, label }: EditorProps) {
    const collabExtension = useCollabExtension(ytext)
    const assignment = useAssignment()
    const codeLanguage = assignment.codeLanguage

    const { data: languageExtension } = useSuspenseQuery({
        queryKey: ["codemirror-language", codeLanguage],
        queryFn: () => getCodemirrorLoader(codeLanguage)(),
    })

    const extensions = useMemo(() => {
        const base = [collabExtension, languageExtension]
        if (readOnly) {
            return base
        }
        return [...base, scrollPastEnd()]
    }, [collabExtension, languageExtension, readOnly])

    const rawValue = ytext.toString()
    const initialValue = readOnly ? rawValue.trimEnd() : rawValue

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
                    basicSetup={readOnly ? readOnlySetup : editableSetup}
                    theme={readOnly ? readOnlyTheme : undefined}
                    height="100%"
                />
            </div>
        </div>
    )
}
