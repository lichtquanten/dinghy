import { useMemo } from "react"
import { useWherebyMeetingUrl } from "../hooks/session"

interface WherebyEmbedProps {
    mode: "none" | "audio-only"
}

export function WherebyEmbed({ mode }: WherebyEmbedProps) {
    const wherebyMeetingUrl = useWherebyMeetingUrl()

    const embedUrl = useMemo(() => {
        const url = new URL(wherebyMeetingUrl)
        url.searchParams.set("embed", "")
        url.searchParams.set("video", "off")
        url.searchParams.set("minimal", "")
        return url.toString()
    }, [wherebyMeetingUrl])

    if (mode === "none") return null

    return (
        <iframe
            src={embedUrl}
            allow="camera; microphone; autoplay"
            className="fixed w-0 h-0 overflow-hidden opacity-0 pointer-events-none"
            title="Whereby Audio Session"
        />
    )
}
