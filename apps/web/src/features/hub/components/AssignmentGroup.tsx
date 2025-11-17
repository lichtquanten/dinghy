import type { ReactNode } from "react"

interface AssignmentGroupProps {
    title: string
    icon: ReactNode
    emptyState?: ReactNode
    children: ReactNode
}

export function AssignmentGroup({
    title,
    icon,
    emptyState,
    children,
}: AssignmentGroupProps) {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3 mb-8">
                {icon}
                <h2 className="text-4xl font-black">{title}</h2>
            </div>
            {emptyState ?? children}
        </div>
    )
}
