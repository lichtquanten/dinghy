import { useSuspenseQuery } from "@tanstack/react-query"
import { Bot, Code2 } from "lucide-react"
import { type ReactNode, Suspense, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Skeleton } from "@workspace/ui/components/skeleton.tsx"
import { trpc } from "@/lib/trpc"
import Ai from "./ai/Ai"
import Sidebar from "./components/Sidebar"
import Ide from "./ide/Ide"

const assignmentSlug = "string-length"

interface MenuItemConfig {
    key: string
    label: string
    icon: ReactNode
    content: ReactNode
}

function StudioContent() {
    const { data: assignment } = useSuspenseQuery(
        trpc.assignment.getBySlug.queryOptions({
            slug: assignmentSlug,
        })
    )

    const menuItemsConfig = [
        {
            key: "ide",
            label: "IDE",
            icon: <Code2 size={18} />,
            content: <Ide assignment={assignment} />,
        },
        {
            key: "ai",
            label: "AI",
            icon: <Bot size={18} />,
            content: <Ai />,
        },
    ] as const satisfies readonly MenuItemConfig[]

    type MenuItemKey = (typeof menuItemsConfig)[number]["key"]

    const [menuItemKey, setMenuItemKey] = useState<MenuItemKey>("ide")

    const selectedConfig = menuItemsConfig.find(
        (item) => item.key === menuItemKey
    )

    return (
        <div className="flex h-10">
            <Sidebar
                items={menuItemsConfig.map(({ key, label, icon }) => ({
                    key,
                    label,
                    icon,
                }))}
                selectedKey={menuItemKey}
                onSelect={setMenuItemKey}
            />
            <main className="flex-1">{selectedConfig?.content}</main>
        </div>
    )
}

export default function Studio() {
    return (
        <ErrorBoundary
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="text-center">
                        <p className="text-destructive text-lg font-semibold">
                            Failed to load assignment
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Please check your connection and try again
                        </p>
                    </div>
                </div>
            }
        >
            <Suspense
                fallback={
                    <div className="min-h-screen grid grid-rows-[auto_1fr] bg-background">
                        <main className="container mx-auto px-4 py-4 md:py-6">
                            <Skeleton className="h-[600px] w-full rounded-lg" />
                        </main>
                    </div>
                }
            >
                <StudioContent />
            </Suspense>
        </ErrorBoundary>
    )
}
