import { createContext } from "react"

export interface SessionInitData {
    sessionId: string
    wherebyMeetingUrl: string
}

export const SessionInitContext = createContext<SessionInitData | null>(null)
