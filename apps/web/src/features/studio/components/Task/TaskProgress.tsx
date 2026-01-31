import { ArrowRight, CheckCircle2, Circle } from 'lucide-react'
import type { Task } from '../../types'

interface TaskProgressProps {
  tasks: Task[]
  currentTaskIndex: number
}

export function TaskProgress({ tasks, currentTaskIndex }: TaskProgressProps) {
  return (
    <div className="space-y-2">
      {tasks.map((task, index) => {
        const isCompleted = index < currentTaskIndex
        const isCurrent = index === currentTaskIndex
        const isUpcoming = index > currentTaskIndex

        return (
          <div
            key={task.id}
            className={`flex items-center gap-2 text-sm ${
              isCurrent ? 'font-medium' : ''
            } ${isUpcoming ? 'text-muted-foreground' : ''}`}
          >
            {isCompleted && <CheckCircle2 className="h-4 w-4 text-green-600" />}
            {isCurrent && <ArrowRight className="h-4 w-4 text-blue-600" />}
            {isUpcoming && <Circle className="h-4 w-4" />}
            <span>
              Task {index + 1}: {task.title}
            </span>
          </div>
        )
      })}
    </div>
  )
}
