import { useSuspenseQuery } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { trpc } from "@/lib/trpc"

export function SessionInit({
    pairingId,
    children,
}: {
    pairingId: string
    children: ReactNode
}) {
    useSuspenseQuery({
        ...trpc.session.init.queryOptions({ pairingId }),
        staleTime: Infinity,
    })

    return <>{children}</>
}
