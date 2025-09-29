import type { Context as HonoContext } from "hono"
import { getAuth } from "@hono/clerk-auth"
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"

export function createContext(_: FetchCreateContextFnOptions, c: HonoContext) {
    const auth = getAuth(c)

    return {
        userId: auth?.userId ?? null,
    }
}

export type Context = Awaited<ReturnType<typeof createContext>>
