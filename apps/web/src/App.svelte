<script lang="ts">
    import { createTRPCProxyClient, httpBatchLink } from "@trpc/client"
    import {
        ClerkProvider,
        SignedIn,
        SignedOut,
        SignInButton,
        UserButton,
    } from "svelte-clerk/client"
    import viteLogo from "/vite.svg"
    import type { AppRouter } from "../../api/src/trpc/router.ts"
    import svelteLogo from "./assets/svelte.svg"
    import Counter from "./lib/Counter.svelte"
    import { env } from "./config/env.js"
    import { onMount } from "svelte"

    const client = createTRPCProxyClient<AppRouter>({
        links: [
            httpBatchLink({
                url: "/trpc",
            }),
        ],
    })

    async function testProfileQuery() {
        try {
            // 1. Call the function
            const result = await client.user.getMyProfile.query()

            // 2. Alert the result to confirm it works
            alert(
                "Profile Query Successful! Result: " +
                    JSON.stringify(result, null, 2)
            )

            // 3. Optional console log for more detail
            console.log("MyProfile Result:", result)
        } catch (error) {
            alert("Profile Query FAILED. Check console for details.")
            console.error("Error calling getMyProfile:", error)
        }
    }
    onMount(async () => {
        const result = await client.hello.query("Hono")
        alert(result)
    })

    // alert(await client.hello.query("Hono"))
</script>

<ClerkProvider publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}>
    <main>
        <header>
            <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </header>
        <button onclick={testProfileQuery}>
            Test Get My Profile (Alert Result)
        </button>
        <div>
            <a href="https://vite.dev" target="_blank" rel="noreferrer">
                <img src={viteLogo} class="logo" alt="Vite Logo" />
            </a>
            <a href="https://svelte.dev" target="_blank" rel="noreferrer">
                <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
            </a>
        </div>
        <h1>Vite + Svelte</h1>

        <div class="card">
            <Counter />
        </div>

        <p>
            Check out <a
                href="https://github.com/sveltejs/kit#readme"
                target="_blank"
                rel="noreferrer">SvelteKit</a
            >, the official Svelte app framework powered by Vite!
        </p>

        <p class="read-the-docs">
            Click on the Vite and Svelte logos to learn more
        </p>
    </main>
</ClerkProvider>

<style>
    .logo {
        height: 6em;
        padding: 1.5em;
        will-change: filter;
        transition: filter 300ms;
    }
    .logo:hover {
        filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.svelte:hover {
        filter: drop-shadow(0 0 2em #ff3e00aa);
    }
    .read-the-docs {
        color: #888;
    }
</style>
