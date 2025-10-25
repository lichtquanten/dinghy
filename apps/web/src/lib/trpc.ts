import { createTRPCClient, httpBatchLink } from "@trpc/client"
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"
import superjson from "superjson"
import type { AppRouter } from "@workspace/api"
import { queryClient } from "./query"

const trpcClient = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({
            url: "/api/trpc",
            transformer: superjson,
        }),
    ],
})

export const trpc = createTRPCOptionsProxy<AppRouter>({
    client: trpcClient,
    queryClient,
})
