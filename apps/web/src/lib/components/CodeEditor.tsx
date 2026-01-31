import { useQuery } from "@tanstack/react-query"
import CodeMirror from "@uiw/react-codemirror"
import { type CodeLanguageKey, getCodemirrorLoader } from "@workspace/code-languages"
import { cn } from "@workspace/ui/lib/utils"

interface CodeEditorProps {
  value: string
  onChange?: (value: string) => void
  language: CodeLanguageKey
  readOnly?: boolean
  className?: string
}

export function CodeEditor({ value, onChange, language, readOnly = false, className }: CodeEditorProps) {
  const { data: languageSupport } = useQuery({
    queryKey: ["code-syntax", language] as const,
    queryFn: () => getCodemirrorLoader(language)(),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  })

  return (
    <CodeMirror
      value={value}
      height="100%"
      extensions={languageSupport ? [languageSupport] : []}
      onChange={onChange}
      editable={!readOnly}
      className={cn(
        "h-full text-base",
        readOnly && "opacity-90 bg-zinc-900/50",
        className
      )}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLineGutter: true,
        highlightActiveLine: !readOnly,
        foldGutter: true,
        readOnly,
      }}
    />
  )
}
