// components/Toolkit.tsx
import { CheckCircle2, FileText, Terminal } from "lucide-react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@workspace/ui/components/accordion.tsx"
import Instructions from "./panels/Instructions"
import Playground from "./panels/Playground"
import Tests from "./panels/Tests"

interface ToolkitProps {
    code: string
}

export default function Toolkit({ code }: ToolkitProps) {
    return (
        <div className="flex-1 flex flex-col border rounded-lg bg-slate-50 overflow-y-auto">
            <Accordion
                type="single"
                defaultValue="instructions"
                className="flex-1 flex flex-col h-full"
                collapsible
            >
                <AccordionItem value="instructions">
                    <AccordionTrigger className="px-4 py-3 hover:bg-slate-100 bg-slate-100">
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
                    <AccordionTrigger className="px-4 py-3 hover:bg-slate-100 bg-slate-100">
                        <div className="flex items-center gap-2.5">
                            <Terminal className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium">
                                Playground
                            </span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="flex-1">
                        <Playground code={code} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="tests">
                    <AccordionTrigger className="px-4 hover:bg-slate-100 bg-slate-100">
                        <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-medium">Tests</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <Tests code={code} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
