interface TaskInstructionsProps {
    instructions: string
}

export function Instructions({ instructions }: TaskInstructionsProps) {
    return <div className="text-sm whitespace-pre-line">{instructions}</div>
}
