import CodeMirror from "@uiw/react-codemirror"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card.tsx"

interface StdinInputProps {
    stdin: string
    onStdinChange: (value: string) => void
}

export const StdinInput = ({ stdin, onStdinChange }: StdinInputProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Standard Input (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-2">
                    <div className="h-[100px] border rounded-md overflow-hidden">
                        <CodeMirror
                            value={stdin}
                            height="100%"
                            onChange={onStdinChange}
                            className="h-full text-base"
                            basicSetup={{
                                lineNumbers: false,
                                highlightActiveLineGutter: false,
                                highlightActiveLine: false,
                            }}
                            placeholder="Input for your program..."
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
