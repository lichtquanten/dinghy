import { LoadingSpinner } from "./LoadingSpinner"

export function FullPageLoader() {
    return (
        <div className="flex-1 flex items-center justify-center h-screen">
            <LoadingSpinner />
        </div>
    )
}
