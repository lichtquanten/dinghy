import { UserButton } from "@clerk/clerk-react"

export default function Header() {
    return (
        <header className="h-12 border-b border-border flex items-center justify-end px-4 bg-white shadow-sm">
            <UserButton />
        </header>
    )
}
