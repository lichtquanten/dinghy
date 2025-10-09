import { createTRPCProxyClient, httpBatchLink } from "@trpc/client"
import type { AppRouter } from "@workspace/api"

export const trpcClient = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: "/api/trpc",
        }),
    ],
})
