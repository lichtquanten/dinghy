// src/features/LandingPage.tsx
import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
} from "@clerk/clerk-react"
import { ArrowRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button.tsx"

export default function Landing() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-1 flex items-center justify-center">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-2xl mx-auto text-center space-y-8">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            dinghy
                        </h1>

                        <p className="text-xl text-muted-foreground">
                            A place to practice programming
                        </p>

                        <div className="flex gap-4 justify-center">
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <Button variant="outline" size="lg">
                                        Sign In
                                    </Button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <Button size="lg">Sign Up</Button>
                                </SignUpButton>
                            </SignedOut>
                            <SignedIn>
                                <Button size="lg" className="gap-2">
                                    Open IDE
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </SignedIn>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="border-t py-6">
                <div className="container mx-auto px-4">
                    <p className="text-center text-sm text-muted-foreground">
                        Write, run, and test code online
                    </p>
                </div>
            </footer>
        </div>
    )
}
