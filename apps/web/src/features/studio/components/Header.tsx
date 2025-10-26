import { UserButton } from "@clerk/clerk-react"
import { ArrowLeft, HelpCircle } from "lucide-react"
import { Button } from "@workspace/ui/components/button.tsx"
import { useAssignment } from "../context"

export default function Header() {
    const assignment = useAssignment()

    return (
        <header className="h-12 border-b border-border flex items-center justify-between px-4 bg-white shadow-sm">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                </Button>
                <h1 className="text-sm font-medium text-foreground">
                    {assignment.title}
                </h1>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    title="Help"
                >
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </Button>
                <UserButton />
            </div>
        </header>
    )
}
