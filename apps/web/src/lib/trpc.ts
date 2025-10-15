import type { AppRouter } from "@workspace/api"
import { queryClient } from "./query"

import { createTRPCClient, httpBatchLink } from "@trpc/client"
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"

const trpcClient = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({
            url: "/api/trpc",
        }),
    ],
})

export const trpc = createTRPCOptionsProxy<AppRouter>({
    client: trpcClient,
    queryClient,
})
