import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { CopyIcon, RefreshCcwIcon } from "lucide-react"
import { Fragment, useState } from "react"
import type { ModelId } from "@workspace/ai-models"
import {
    Action,
    Actions,
} from "@workspace/ui/components/ai-elements/actions.tsx"
import {
    Conversation,
    ConversationContent,
    ConversationScrollButton,
} from "@workspace/ui/components/ai-elements/conversation.tsx"
import { Loader } from "@workspace/ui/components/ai-elements/loader.tsx"
import {
    Message,
    MessageContent,
} from "@workspace/ui/components/ai-elements/message.tsx"
import {
    PromptInput,
    PromptInputBody,
    PromptInputFooter,
    type PromptInputMessage,
    PromptInputModelSelect,
    PromptInputModelSelectContent,
    PromptInputModelSelectItem,
    PromptInputModelSelectTrigger,
    PromptInputModelSelectValue,
    PromptInputSubmit,
    PromptInputTextarea,
    PromptInputTools,
} from "@workspace/ui/components/ai-elements/prompt-input.tsx"
import { Response } from "@workspace/ui/components/ai-elements/response.tsx"
import {
    Source,
    Sources,
    SourcesContent,
    SourcesTrigger,
} from "@workspace/ui/components/ai-elements/sources.tsx"
import { models } from "@/lib/ai/api"

export default function AiChat() {
    const [input, setInput] = useState("")
    const [model, setModel] = useState<ModelId>("deepseek-chat")
    const { messages, sendMessage, status, regenerate } = useChat({
        transport: new DefaultChatTransport({
            api: "/api/ai/chat",
        }),
    })

    const handleSubmit = (message: PromptInputMessage) => {
        const hasText = Boolean(message.text)

        if (!hasText) {
            return
        }

        void sendMessage(
            {
                text: message.text || "",
            },
            {
                body: {
                    model: model,
                },
            }
        )
        setInput("")
    }

    return (
        <div className="max-w-4xl mx-auto p-6 relative size-full h-screen">
            <div className="flex flex-col h-full">
                <Conversation className="h-full">
                    <ConversationContent>
                        {messages.map((message) => (
                            <div key={message.id}>
                                {message.role === "assistant" &&
                                    message.parts.filter(
                                        (part) => part.type === "source-url"
                                    ).length > 0 && (
                                        <Sources>
                                            <SourcesTrigger
                                                count={
                                                    message.parts.filter(
                                                        (part) =>
                                                            part.type ===
                                                            "source-url"
                                                    ).length
                                                }
                                            />
                                            {message.parts
                                                .filter(
                                                    (part) =>
                                                        part.type ===
                                                        "source-url"
                                                )
                                                .map((part, i) => (
                                                    <SourcesContent
                                                        key={`${message.id}-${i}`}
                                                    >
                                                        <Source
                                                            key={`${message.id}-${i}`}
                                                            href={part.url}
                                                            title={part.url}
                                                        />
                                                    </SourcesContent>
                                                ))}
                                        </Sources>
                                    )}
                                {message.parts.map((part, i) => {
                                    if (part.type != "text") return
                                    return (
                                        <Fragment key={`${message.id}-${i}`}>
                                            <Message from={message.role}>
                                                <MessageContent>
                                                    <Response>
                                                        {part.text}
                                                    </Response>
                                                </MessageContent>
                                            </Message>
                                            {message.role === "assistant" &&
                                                i === messages.length - 1 && (
                                                    <Actions className="mt-2">
                                                        <Action
                                                            onClick={() =>
                                                                regenerate()
                                                            }
                                                            label="Retry"
                                                        >
                                                            <RefreshCcwIcon className="size-3" />
                                                        </Action>
                                                        <Action
                                                            onClick={() =>
                                                                navigator.clipboard.writeText(
                                                                    part.text
                                                                )
                                                            }
                                                            label="Copy"
                                                        >
                                                            <CopyIcon className="size-3" />
                                                        </Action>
                                                    </Actions>
                                                )}
                                        </Fragment>
                                    )
                                })}
                            </div>
                        ))}
                        {status === "submitted" && <Loader />}
                    </ConversationContent>
                    <ConversationScrollButton />
                </Conversation>

                <PromptInput
                    onSubmit={handleSubmit}
                    className="mt-4"
                    globalDrop
                    multiple
                >
                    <PromptInputBody>
                        <PromptInputTextarea
                            onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>
                            ) => setInput(e.target.value)}
                            value={input}
                        />
                    </PromptInputBody>
                    <PromptInputFooter>
                        <PromptInputTools>
                            <PromptInputModelSelect
                                onValueChange={(modelId: ModelId) => {
                                    setModel(modelId)
                                }}
                                value={model}
                            >
                                <PromptInputModelSelectTrigger>
                                    <PromptInputModelSelectValue />
                                </PromptInputModelSelectTrigger>
                                <PromptInputModelSelectContent>
                                    {models.map((model) => (
                                        <PromptInputModelSelectItem
                                            key={model.id}
                                            value={model.id}
                                        >
                                            {model.label}
                                        </PromptInputModelSelectItem>
                                    ))}
                                </PromptInputModelSelectContent>
                            </PromptInputModelSelect>
                        </PromptInputTools>
                        <PromptInputSubmit
                            disabled={!input && !status}
                            status={status}
                        />
                    </PromptInputFooter>
                </PromptInput>
            </div>
        </div>
    )
}
