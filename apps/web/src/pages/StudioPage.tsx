import { StudioCarousel } from "@/components/studio/StudioCarousel"
import { IdePanel } from "@/components/studio/IdePanel"
import { AiChat } from "@/components/AiChat"
import { useSuspenseQuery } from "@tanstack/react-query"
import { trpc } from "@/lib/trpc"
import { Suspense } from "react"
import { Skeleton } from "@workspace/ui/components/skeleton.tsx"

const assignmentSlug = "string-length"

function StudioContent() {
    const { data: assignment } = useSuspenseQuery(
        trpc.assignment.getBySlug.queryOptions({
            slug: assignmentSlug,
        })
    )

    const panels = [
        {
            id: "ide",
            content: <IdePanel key={assignment.slug} assignment={assignment} />,
        },
        {
            id: "chat",
            content: <AiChat />,
        },
    ]

    return (
        <div className="min-h-screen grid grid-rows-[auto_1fr] bg-background">
            <main className="container mx-auto px-4 py-4 md:py-6">
                <StudioCarousel panels={panels} />
            </main>
        </div>
    )
}

export const StudioPage = () => {
    return (
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
    )
}
