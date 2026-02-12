import { useCallback, useState } from "react"
import "@whereby.com/browser-sdk/embed"
import { useWherebyMeetingUrl } from "../hooks/session"

interface WherebyEmbedProps {
    mode: "none" | "audio-only"
    displayName: string
}

export function WherebyEmbed({ mode, displayName }: WherebyEmbedProps) {
    const wherebyMeetingUrl = useWherebyMeetingUrl()
    const [joined, setJoined] = useState(false)

    const wherebyRef = useCallback((el: HTMLElement | null) => {
        if (!el) return
        el.addEventListener("join", () => setJoined(true))
        el.addEventListener("leave", () => setJoined(false))
    }, [])

    if (mode === "none") return null

    return (
        <>
            {!joined && (
                <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm text-center space-y-3">
                        <div className="text-2xl">🎙️</div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Microphone access needed
                        </h2>
                        <p className="text-sm text-gray-500">
                            Please allow microphone access to join the session.
                        </p>
                    </div>
                </div>
            )}

            <div
                className={`fixed bottom-4 left-4 z-50 rounded-lg shadow-lg overflow-hidden transition-all ${
                    joined ? "w-72 h-50" : "w-80 h-48"
                }`}
            >
                <whereby-embed
                    autoHideSelfView="on"
                    background="off"
                    bottomToolbar="off"
                    breakout="off"
                    cameraAccess="off"
                    chat="off"
                    displayName={displayName}
                    floatSelf="off"
                    leaveButton="off"
                    localization="off"
                    locking="off"
                    logo="off"
                    minimal=""
                    moreButton="off"
                    participantCount="off"
                    people="off"
                    pipButton="off"
                    precallCeremony="off"
                    ref={wherebyRef}
                    room={wherebyMeetingUrl}
                    screenshare="off"
                    style={{ width: "100%", height: "100%" }}
                    timer="off"
                    video="off"
                />
            </div>
        </>
    )
}
