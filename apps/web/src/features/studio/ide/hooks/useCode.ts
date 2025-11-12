import { useSuspenseQuery } from "@tanstack/react-query"
import { useState } from "react"
import { trpc } from "@/lib/trpc"

export function useCode(assignmentId: string, starterCode: string) {
    const { data: progress } = useSuspenseQuery(
        trpc.progress.get.queryOptions({
            assignmentId: assignmentId,
        })
    )

    const [code, setCode] = useState(progress?.code ?? starterCode ?? "")

    return { code, setCode }
}
