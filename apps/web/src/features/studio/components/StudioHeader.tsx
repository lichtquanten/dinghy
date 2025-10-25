import { Code2 } from "lucide-react"

export const StudioHeader = () => {
    return (
        <header className="border-b">
            <div className="container mx-auto px-4 py-3 md:py-4">
                <div className="flex items-center gap-2 md:gap-3">
                    <Code2 className="h-5 w-5 md:h-6 md:w-6 shrink-0" />
                    <h1 className="text-xl md:text-2xl font-bold truncate">
                        Code Studio
                    </h1>
                </div>
            </div>
        </header>
    )
}
