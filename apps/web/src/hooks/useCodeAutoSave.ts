import { useEffect, useRef } from "react"
import { useDebounce } from "use-debounce"
import { trpc } from "@/lib/trpc"
import { useMutation } from "@tanstack/react-query"

export function useCodeAutoSave(assignmentSlug: string, code: string) {
    const [debouncedCode] = useDebounce(code, 1000)
    const lastSavedCode = useRef("")

    const {
        mutate: saveCode,
        isPending,
        isSuccess,
        data,
    } = useMutation(trpc.progress.save.mutationOptions({}))

    useEffect(() => {
        if (!debouncedCode || debouncedCode === lastSavedCode.current) return

        saveCode({
            assignmentSlug,
            code: debouncedCode,
        })
    }, [debouncedCode, assignmentSlug, saveCode])

    useEffect(() => {
        if (data?.code) {
            lastSavedCode.current = data.code
        }
    }, [data])

    return { isSaving: isPending, isSaved: isSuccess && !isPending }
}
