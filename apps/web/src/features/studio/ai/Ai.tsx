import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { CopyIcon } from "lucide-react"
import { Fragment, useState } from "react"
import type { ModelId } from "@workspace/ai-models"
import {
    Action,
    Actions,
} from "@workspace/ui/components/ai-elements/actions.js"
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
import { models } from "@/lib/ai/api"

interface TextPart {
    type: "text"
    text: string
}

interface UIMessage {
    id: string
    role: "system" | "user" | "assistant"
    parts: TextPart[]
}

function getMessageText(message: UIMessage): string {
    const textPart = message.parts.find((part) => part.type === "text")
    return textPart?.text ?? ""
}

function MessageActions({ text }: { text: string }) {
    return (
        <Actions>
            <Action
                onClick={() => navigator.clipboard.writeText(text)}
                label="Copy"
            >
                <CopyIcon className="size-3" />
            </Action>
        </Actions>
    )
}

function ChatMessageItem({ message }: { message: UIMessage }) {
    const text = getMessageText(message)

    return (
        <Fragment>
            <Message from={message.role}>
                <MessageContent>
                    <Response>{text}</Response>
                </MessageContent>
            </Message>
            {message.role === "assistant" && <MessageActions text={text} />}
        </Fragment>
    )
}

function MessagesList({ messages }: { messages: UIMessage[] }) {
    return (
        <>
            {messages.map((message, _) => (
                <ChatMessageItem key={message.id} message={message} />
            ))}
        </>
    )
}

function ModelSelector({
    value,
    onChange,
}: {
    value: ModelId
    onChange: (modelId: ModelId) => void
}) {
    return (
        <PromptInputModelSelect onValueChange={onChange} value={value}>
            <PromptInputModelSelectTrigger>
                <PromptInputModelSelectValue />
            </PromptInputModelSelectTrigger>
            <PromptInputModelSelectContent>
                {models.map((model) => (
                    <PromptInputModelSelectItem key={model.id} value={model.id}>
                        {model.label}
                    </PromptInputModelSelectItem>
                ))}
            </PromptInputModelSelectContent>
        </PromptInputModelSelect>
    )
}

function ChatInput({
    value,
    onChange,
    onSubmit,
    model,
    onModelChange,
    disabled,
}: {
    value: string
    onChange: (value: string) => void
    onSubmit: (message: PromptInputMessage) => void
    model: ModelId
    onModelChange: (modelId: ModelId) => void
    disabled: boolean
}) {
    return (
        <PromptInput
            onSubmit={onSubmit}
            className="mt-4 flex-shrink-0"
            globalDrop
            multiple
        >
            <PromptInputBody>
                <PromptInputTextarea
                    onChange={(e) => onChange(e.target.value)}
                    value={value}
                />
            </PromptInputBody>
            <PromptInputFooter>
                <PromptInputTools>
                    <ModelSelector value={model} onChange={onModelChange} />
                </PromptInputTools>
                <PromptInputSubmit disabled={disabled} />
            </PromptInputFooter>
        </PromptInput>
    )
}

export default function AiChat() {
    const [input, setInput] = useState("")
    const [model, setModel] = useState<ModelId>("deepseek-chat")

    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({
            api: "/api/ai/chat",
        }),
    })

    const handleSubmit = (message: PromptInputMessage) => {
        if (!message.text) return

        void sendMessage({ text: message.text }, { body: { model } })
        setInput("")
    }

    return (
        <div className="w-full h-full flex flex-col p-6">
            <div className="flex flex-col flex-1 max-w-4xl mx-auto w-full min-h-0">
                <Conversation className="flex-1 min-h-0 overflow-y-auto">
                    <ConversationContent>
                        <MessagesList messages={messages as UIMessage[]} />
                        {status === "submitted" && <Loader />}
                    </ConversationContent>
                    <ConversationScrollButton />
                </Conversation>

                <ChatInput
                    value={input}
                    onChange={setInput}
                    onSubmit={handleSubmit}
                    model={model}
                    onModelChange={setModel}
                    disabled={!input.trim()}
                />
            </div>
        </div>
    )
}
