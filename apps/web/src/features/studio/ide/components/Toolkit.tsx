// components/Toolkit.tsx
import { CheckCircle2, FileText, Terminal } from "lucide-react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@workspace/ui/components/accordion.tsx"
import { Button } from "@workspace/ui/components/button.js"
import Instructions from "./panels/Instructions"
import Playground from "./panels/Playground"
import Tests from "./panels/Tests"

interface ToolkitProps {
    code: string
    onSubmit: () => void
    isSubmitting: boolean
}

export default function Toolkit({
    code,
    onSubmit,
    isSubmitting,
}: ToolkitProps) {
    return (
        <div className="flex-1 flex flex-col gap-2 min-w-0 md:min-w-sm">
            <div className="flex-1 border rounded-lg bg-slate-50 overflow-y-auto min-h-0">
                <Accordion
                    type="single"
                    defaultValue="instructions"
                    collapsible
                >
                    <AccordionItem value="instructions">
                        <AccordionTrigger className="px-4 py-3 hover:bg-slate-100">
                            <div className="flex items-center gap-2.5">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                    Instructions
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <Instructions />
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="playground">
                        <AccordionTrigger className="px-4 py-3 hover:bg-slate-100">
                            <div className="flex items-center gap-2.5">
                                <Terminal className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium">
                                    Playground
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <Playground code={code} />
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="tests">
                        <AccordionTrigger className="px-4 py-3 hover:bg-slate-100">
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm font-medium">
                                    Tests
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <Tests code={code} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <div className="flex justify-end">
                <Button
                    className="w-full bg-slate-800"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Submitting..." : "Submit Assignment"}
                </Button>
            </div>
        </div>
    )
}
