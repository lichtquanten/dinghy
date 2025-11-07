import { useMutation } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { useDebounce } from "use-debounce"
import { trpc } from "@/lib/trpc"

export function useCodeAutoSave(assignmentSlug: string, code: string) {
    const [debouncedCode] = useDebounce(code, 1000)
    const lastSavedCode = useRef("")

    const {
        mutate: saveCode,
        isPending,
        isSuccess,
    } = useMutation({
        ...trpc.progress.save.mutationOptions({}),
        onSuccess: (_, variables) => {
            lastSavedCode.current = variables.code
        },
    })

    useEffect(() => {
        if (!debouncedCode || debouncedCode === lastSavedCode.current) return

        saveCode({
            assignmentSlug,
            code: debouncedCode,
        })
    }, [debouncedCode, assignmentSlug, saveCode])

    return { isSaving: isPending, isSaved: isSuccess && !isPending }
}
