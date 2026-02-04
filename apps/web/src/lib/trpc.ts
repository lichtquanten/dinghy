import {
    createTRPCClient,
    httpBatchLink,
    httpSubscriptionLink,
    splitLink,
} from "@trpc/client"
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"
import superjson from "superjson"
import type { AppRouter } from "@workspace/api"
import { queryClient } from "./query"

const trpcClient = createTRPCClient<AppRouter>({
    links: [
        splitLink({
            condition: (op) => op.type === "subscription",
            true: httpSubscriptionLink({
                url: "/api/trpc",
                transformer: superjson,
            }),
            false: httpBatchLink({
                url: "/api/trpc",
                transformer: superjson,
            }),
        }),
    ],
})

export const trpc = createTRPCOptionsProxy<AppRouter>({
    client: trpcClient,
    queryClient,
})
