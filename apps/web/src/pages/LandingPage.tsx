// src/pages/LandingPage.tsx
import { Button } from "@workspace/ui/components/button"
import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
    UserButton,
} from "@clerk/clerk-react"
import { Code2, ArrowRight } from "lucide-react"

export const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Navigation */}
            <header className="border-b">
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Code2 className="h-6 w-6" />
                            <span className="text-xl font-bold">dinghy</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <Button variant="ghost">Sign In</Button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <Button>Sign Up</Button>
                                </SignUpButton>
                            </SignedOut>
                            <SignedIn>
                                <Button className="gap-2">
                                    <ArrowRight className="h-4 w-4" />
                                    Open IDE
                                </Button>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
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
                                    <Button size="lg">Get Started</Button>
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

            {/* Footer */}
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
