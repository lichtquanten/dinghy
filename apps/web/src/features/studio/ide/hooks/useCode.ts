import { useSuspenseQuery } from "@tanstack/react-query"
import { useState } from "react"
import type { AssignmentPublic } from "@workspace/database"
import { trpc } from "@/lib/trpc"

export function useCode(assignment: AssignmentPublic) {
    const { data: progress } = useSuspenseQuery(
        trpc.progress.get.queryOptions({
            assignmentSlug: assignment.slug,
        })
    )
    const [code, setCode] = useState(
        progress?.code ?? assignment.starterCode ?? ""
    )

    return { code, setCode }
}
