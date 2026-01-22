import { Code2, type LucideIcon } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils.ts"
import type { WorkspaceView } from "../Studio"

interface SidebarItemConfig {
    label: string
    icon: LucideIcon
}

const SIDEBAR_ITEMS = {
    ide: { label: "IDE", icon: Code2 },
} as const satisfies Record<WorkspaceView, SidebarItemConfig>

interface SidebarProps {
    activeView: WorkspaceView
    onViewChange: (view: WorkspaceView) => void
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
    return (
        <div className="w-32 border border-border rounded-lg flex flex-col items-center py-6 gap-2 bg-white shadow-sm">
            {(
                Object.entries(SIDEBAR_ITEMS) as Array<
                    [WorkspaceView, SidebarItemConfig]
                >
            ).map(([view, { label, icon: Icon }]) => (
                <button
                    key={view}
                    onClick={() => onViewChange(view)}
                    className={cn(
                        "w-24 flex flex-col items-center gap-3 py-5 rounded-lg transition-all duration-200",
                        "text-muted-foreground hover:bg-slate-100",
                        activeView === view &&
                            "bg-slate-100 text-primary shadow-sm ring-2 ring-primary/20"
                    )}
                >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{label}</span>
                </button>
            ))}
        </div>
    )
}
