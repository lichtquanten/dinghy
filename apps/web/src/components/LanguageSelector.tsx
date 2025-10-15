// src/components/LanguageSelector.tsx
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select"
import { PROGRAMMING_LANGUAGES } from "@/config/consts"

interface LanguageSelectorProps {
    value: number
    onChange: (value: number) => void
}

export const LanguageSelector = ({
    value,
    onChange,
}: LanguageSelectorProps) => {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">Language</label>
            <Select
                value={value.toString()}
                onValueChange={(v) => onChange(Number(v))}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                    {PROGRAMMING_LANGUAGES.map((lang) => (
                        <SelectItem key={lang.id} value={lang.id.toString()}>
                            {lang.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
