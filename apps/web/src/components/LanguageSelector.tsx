// src/components/LanguageSelector.tsx
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select.tsx"

import { CODE_LANGUAGES, type CodeLanguageKey } from "@workspace/code-languages"

interface LanguageSelectorProps {
    language: CodeLanguageKey
    onChange: (value: CodeLanguageKey) => void
}

export const LanguageSelector = ({
    language,
    onChange,
}: LanguageSelectorProps) => {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">Language</label>
            <Select
                value={language}
                onValueChange={(v: CodeLanguageKey) => onChange(v)}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                    {CODE_LANGUAGES.map((lang) => (
                        <SelectItem key={lang.key} value={lang.key}>
                            {lang.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
