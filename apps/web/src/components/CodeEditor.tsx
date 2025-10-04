// src/components/CodeEditor.tsx
import { Textarea } from "@workspace/ui/components/textarea"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card"
import { Label } from "@workspace/ui/components/label"

interface CodeEditorProps {
    code: string
    stdin: string
    onCodeChange: (value: string) => void
    onStdinChange: (value: string) => void
}

export const CodeEditor = ({
    code,
    stdin,
    onCodeChange,
    onStdinChange,
}: CodeEditorProps) => {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Code Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="code">Source Code</Label>
                    <Textarea
                        id="code"
                        value={code}
                        onChange={(e) => onCodeChange(e.target.value)}
                        className="min-h-[400px] font-mono text-sm"
                        placeholder="Enter your code here..."
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="stdin">Standard Input (optional)</Label>
                    <Textarea
                        id="stdin"
                        value={stdin}
                        onChange={(e) => onStdinChange(e.target.value)}
                        className="min-h-[100px] font-mono text-sm"
                        placeholder="Input for your program..."
                    />
                </div>
            </CardContent>
        </Card>
    )
}
