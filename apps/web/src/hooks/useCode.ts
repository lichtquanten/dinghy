import { useState } from "react"
import { trpc } from "@/lib/trpc"
import type { AssignmentPublic } from "@workspace/database/types/assignment.js"
import { useSuspenseQuery } from "@tanstack/react-query"

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
