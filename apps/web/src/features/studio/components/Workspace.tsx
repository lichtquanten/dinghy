import type { WorkspaceView } from "../Studio"

interface WorkspaceProps {
    view: WorkspaceView
    children: {
        ide: React.ReactNode
    }
}

export default function Workspace({ view, children }: WorkspaceProps) {
    return (
        <div className="relative flex-1 h-full overflow-hidden p-4">
            <div className="h-full bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
                {children[view]}
            </div>
        </div>
    )
}
