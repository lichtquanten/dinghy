import { getAuth } from "@hono/clerk-auth"
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import type { Context as HonoContext } from "hono"

export function createContext(_: FetchCreateContextFnOptions, c: HonoContext) {
    const auth = getAuth(c)

    return {
        auth: auth,
    }
}

export type Context = Awaited<ReturnType<typeof createContext>>
