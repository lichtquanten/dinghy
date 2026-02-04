import { useSuspenseQuery } from "@tanstack/react-query"
import { trpc } from "@/lib/trpc"

export function useSelf() {
    return useSuspenseQuery(trpc.user.self.queryOptions())
}
