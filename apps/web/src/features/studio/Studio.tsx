import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Skeleton } from "@workspace/ui/components/skeleton.tsx"
import { trpc } from "@/lib/trpc"
import Ai from "./ai/Ai"
import Carousel from "./components/Carousel"
import Ide from "./ide/Ide"

const assignmentSlug = "string-length"

// Child component that uses the suspense query
function StudioContent() {
    const { data: assignment } = useSuspenseQuery(
        trpc.assignment.getBySlug.queryOptions({
            slug: assignmentSlug,
        })
    )

    return (
        <div className="min-h-screen grid grid-rows-[auto_1fr] bg-background">
            <main className="container mx-auto px-4 py-4 md:py-6">
                <Carousel>
                    <Ide key={assignment.slug} assignment={assignment} />
                    <Ai />
                </Carousel>
            </main>
        </div>
    )
}

// Parent component with error boundary and suspense
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
