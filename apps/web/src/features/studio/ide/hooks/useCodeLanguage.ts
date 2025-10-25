import { useQuery } from "@tanstack/react-query"
import {
    type CodeLanguageKey,
    getCodemirrorLoader,
} from "@workspace/code-languages"

export function useCodeLanguage(key: CodeLanguageKey) {
    return useQuery({
        queryKey: ["code-syntax", key] as const,
        queryFn: () => getCodemirrorLoader(key)(),
        staleTime: Infinity,
        gcTime: Infinity,
        retry: false,
    })
}
