import { useSuspenseQuery } from "@tanstack/react-query"
import { trpc } from "@/lib/trpc"

export function useSelf() {
    const { data: self } = useSuspenseQuery(trpc.user.self.queryOptions())
    return self
}
