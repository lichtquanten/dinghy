import { useSuspenseQuery } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { trpc } from "@/lib/trpc"

export function PairingInit({
    pairingId,
    children,
}: {
    pairingId: string
    children: ReactNode
}) {
    useSuspenseQuery({
        ...trpc.pairing.init.queryOptions({ pairingId }),
        staleTime: Infinity,
    })

    return <>{children}</>
}
