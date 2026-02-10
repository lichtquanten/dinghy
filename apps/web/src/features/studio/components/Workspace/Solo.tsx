import { useMyCode } from "../../hooks/code"
import { Playground } from "../Playground"
import { Editor } from "./Editor"

export function Solo() {
    const myCode = useMyCode()

    return (
        <div className="flex flex-col lg:flex-row h-full gap-4 p-4">
            <div className="flex-1 overflow-hidden">
                <Editor ytext={myCode.ytext()} />
            </div>
            <div className="lg:w-96 flex-shrink-0">
                <Playground />
            </div>
        </div>
    )
}
