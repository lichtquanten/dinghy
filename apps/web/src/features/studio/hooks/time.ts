import { useSuspenseQuery } from "@tanstack/react-query"
import { useCallback, useState } from "react"
import { trpc } from "@/lib/trpc"

function useServerOffset() {
    const { data: serverTime } = useSuspenseQuery(trpc.time.get.queryOptions())

    const [offset] = useState(() => serverTime - Date.now())

    return offset
}

export function useServerNow() {
    const offset = useServerOffset()
    return useCallback(() => Date.now() + offset, [offset])
}

export function useSecondsSince() {
    const offset = useServerOffset()
    return useCallback(
        (timestamp: number) =>
            Math.floor((Date.now() + offset - timestamp) / 1000),
        [offset]
    )
}
