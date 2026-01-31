import { PanelLeft, PanelLeftClose } from 'lucide-react'
import { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@workspace/ui/components/accordion'
import { Button } from '@workspace/ui/components/button'
import { useStudio } from '../../hooks/StudioContext'
import { TaskInstructions } from './TaskInstructions'
import { TaskOverview } from './TaskOverview'
import { TaskProgress } from './TaskProgress'
import { TaskTestCases } from './TaskTestCases'

export function Task() {
  const [isOpen, setIsOpen] = useState(true)
  const { assignment, currentTask, currentTaskIndex } = useStudio()

  if (!isOpen) {
    return (
      <div className="w-12 border-r flex flex-col items-center pt-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-80 border-r flex flex-col overflow-hidden bg-muted/20">
      <div className="h-14 border-b px-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">
            Task {currentTaskIndex + 1} of {assignment.tasks.length}
          </div>
          <div className="font-semibold text-sm">{currentTask.title}</div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Accordion type="multiple" defaultValue={['instructions']} className="w-full">
          <AccordionItem value="overview">
            <AccordionTrigger className="text-sm font-medium">Overview</AccordionTrigger>
            <AccordionContent>
              <TaskOverview description={assignment.description} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="instructions">
            <AccordionTrigger className="text-sm font-medium">Instructions</AccordionTrigger>
            <AccordionContent>
              <TaskInstructions instructions={currentTask.instructions} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tests">
            <AccordionTrigger className="text-sm font-medium">
              Test Cases ({currentTask.testCases.length})
            </AccordionTrigger>
            <AccordionContent>
              <TaskTestCases testCases={currentTask.testCases} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="progress">
            <AccordionTrigger className="text-sm font-medium">Progress</AccordionTrigger>
            <AccordionContent>
              <TaskProgress tasks={assignment.tasks} currentTaskIndex={currentTaskIndex} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
