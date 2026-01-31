interface TaskInstructionsProps {
  instructions: string
}

export function TaskInstructions({ instructions }: TaskInstructionsProps) {
  return (
    <div className="text-sm whitespace-pre-line">
      {instructions}
    </div>
  )
}
