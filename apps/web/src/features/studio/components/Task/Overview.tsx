interface TaskOverviewProps {
    description: string
}

export function Overview({ description }: TaskOverviewProps) {
    return (
        <div className="text-sm text-muted-foreground whitespace-pre-line">
            {description}
        </div>
    )
}
