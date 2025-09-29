import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import { trpcServer } from "@hono/trpc-server"
import { Hono } from "hono"
import { appRouter } from "./router.js"

const app = new Hono()

app.use(
    "/trpc/*",
    trpcServer({
        router: appRouter,
    })
)

app.use("/*", serveStatic({ root: "./public" }))

serve(
    {
        fetch: app.fetch,
        port: 3000,
    },
    (info) => {
        console.log(`Server is running on http://localhost:${info.port}`)
    }
)
