import { useState, useEffect } from "react"
import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
} from "@clerk/clerk-react"
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import "./App.css"
import type { AppRouter } from "../../api/src/trpc/router.ts"

const client = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: "/trpc",
        }),
    ],
})

function App() {
    const [count, setCount] = useState(0)

    useEffect(() => {
        async function fetchHello() {
            const result = await client.hello.query("Hono")
            alert(result)
        }
        fetchHello()
    }, [])

    return (
        <>
            <header>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </header>
            <div>
                <a href="https://vite.dev" target="_blank" rel="noreferrer">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank" rel="noreferrer">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App
