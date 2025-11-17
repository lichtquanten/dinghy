import { UserButton } from "@clerk/clerk-react"
import { useMutation } from "@tanstack/react-query"
import { AlertCircle, ArrowRight, BookOpen } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@workspace/ui/components/alert.js"
import { Button } from "@workspace/ui/components/button.js"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card.js"
import { Input } from "@workspace/ui/components/input.js"
import { Label } from "@workspace/ui/components/label.js"
import { Spinner } from "@workspace/ui/components/spinner.js"
import { trpc } from "@/lib/trpc"

function Header() {
    return (
        <header className="h-12 border-b border-border flex items-center justify-end px-4 bg-white shadow-sm">
            <UserButton />
        </header>
    )
}

function LoadingState({ joinCode }: { joinCode: string }) {
    return (
        <div className="flex h-screen items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-6">
                <Spinner className="size-16 text-primary" />
                <div className="text-center">
                    <p className="text-muted-foreground text-lg font-medium">
                        Joining course...
                    </p>
                    {joinCode && (
                        <p className="text-sm text-muted-foreground mt-2 font-mono">
                            Code: {joinCode}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

function JoinCourseForm({
    joinCode,
    setJoinCode,
    errorMessage,
    setErrorMessage,
    onSubmit,
    isPending,
}: {
    joinCode: string
    setJoinCode: (code: string) => void
    errorMessage: string
    setErrorMessage: (msg: string) => void
    onSubmit: (e: React.FormEvent) => void
    isPending: boolean
}) {
    return (
        <div className="flex h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-primary/10 p-3">
                            <BookOpen className="size-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {"Let's Get Started"}
                    </h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Enter Course Code</CardTitle>
                        <CardDescription>
                            Ask your instructor or check your course webpage for
                            the code
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-4">
                            {errorMessage && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        {errorMessage}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="joinCode">Course Code</Label>
                                <Input
                                    id="joinCode"
                                    type="text"
                                    value={joinCode}
                                    onChange={(e) => {
                                        setJoinCode(e.target.value)
                                        if (errorMessage) setErrorMessage("")
                                    }}
                                    placeholder="Enter your course code"
                                    className="font-mono"
                                    autoFocus
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isPending || !joinCode.trim()}
                                className="w-full"
                            >
                                Join Course
                                <ArrowRight className="size-4 ml-2" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function JoinCourse() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const urlJoinCode = searchParams.get("code")
    const [joinCode, setJoinCode] = useState<string>(urlJoinCode || "")
    const [errorMessage, setErrorMessage] = useState<string>("")
    const shouldProcessUrlCode = useRef(!!urlJoinCode)

    const { mutate: joinCourse, isPending } = useMutation({
        ...trpc.course.join.mutationOptions(),
        onSuccess: async ({ courseTitle }) => {
            toast.success(`Successfully joined ${courseTitle}!`)
            await navigate("/hub")
        },
        onError: async (error) => {
            setErrorMessage("")
            switch (error.data?.code) {
                case "NOT_FOUND":
                    setErrorMessage(
                        "Invalid course code. Please check and try again."
                    )
                    break
                case "CONFLICT":
                    toast.warning("You're already enrolled in this course!")
                    await navigate("/hub")
                    break
                default:
                    setErrorMessage("Something went wrong. Please try again.")
            }
            console.error("Join course error:", error)
        },
    })

    useEffect(() => {
        if (!shouldProcessUrlCode.current || !urlJoinCode) return
        joinCourse({ joinCode: urlJoinCode })
        shouldProcessUrlCode.current = false
    }, [joinCourse, urlJoinCode])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage("")

        const trimmedCode = joinCode.trim()
        if (!trimmedCode) {
            setErrorMessage("Please enter a course code")
            return
        }

        joinCourse({ joinCode: trimmedCode })
    }

    if (isPending) {
        return <LoadingState joinCode={joinCode} />
    }

    return (
        <>
            <Header />
            <JoinCourseForm
                joinCode={joinCode}
                setJoinCode={setJoinCode}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                onSubmit={handleSubmit}
                isPending={isPending}
            />
        </>
    )
}
