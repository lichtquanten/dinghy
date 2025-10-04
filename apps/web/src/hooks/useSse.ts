import { useEffect, useState, useRef } from "react"

type ConnectionState = "connecting" | "open" | "closed"

type EventData = Record<string, unknown>

interface UseSseOptions extends EventSourceInit {
    onOpen?: () => void
    onError?: (error: Event) => void
    onMessage?: (data: unknown) => void
    events?: string[]
    parseJson?: boolean
}
interface UseSseReturn {
    connectionState: ConnectionState
    connectionError: Event | null
    eventData: EventData
    close: () => void
}
export function useSse(url: string, options?: UseSseOptions): UseSseReturn {
    const [connectionState, setConnectionState] =
        useState<ConnectionState>("connecting")
    const [connectionError, setConnectionError] = useState<Event | null>(null)
    const [eventData, setEventData] = useState<EventData>({})

    const eventSourceRef = useRef<EventSource | null>(null)
    const listenersRef = useRef<Map<string, (e: MessageEvent) => void>>(
        new Map()
    )

    const {
        onOpen,
        onError,
        onMessage,
        events = [],
        parseJson = true,
        ...eventSourceOptions
    } = options || {}

    const onOpenRef = useRef(onOpen)
    const onErrorRef = useRef(onError)
    const onMessageRef = useRef(onMessage)
    const parseJsonRef = useRef(parseJson)

    useEffect(() => {
        onOpenRef.current = onOpen
    }, [onOpen])

    useEffect(() => {
        onErrorRef.current = onError
    }, [onError])

    useEffect(() => {
        onMessageRef.current = onMessage
    }, [onMessage])

    useEffect(() => {
        parseJsonRef.current = parseJson
    }, [parseJson])

    const withCredentials = !!eventSourceOptions.withCredentials

    const close = () => {
        eventSourceRef.current?.close()
        eventSourceRef.current = null
        setConnectionState("closed")
    }

    useEffect(() => {
        const eventSource = new EventSource(url, { withCredentials })
        eventSourceRef.current = eventSource
        const listeners = listenersRef.current

        eventSource.onopen = () => {
            setConnectionState("open")
            setConnectionError(null)
            onOpenRef.current?.()
        }

        eventSource.onerror = (error) => {
            setConnectionError(error)
            if (eventSource.readyState === EventSource.CLOSED) {
                setConnectionState("closed")
            } else {
                setConnectionState("connecting")
            }
            onErrorRef.current?.(error)
        }

        eventSource.onmessage = (e: MessageEvent) => {
            const data = String(e.data)
            const processed = parseJsonRef.current
                ? (() => {
                      try {
                          return JSON.parse(data) as unknown
                      } catch {
                          return data
                      }
                  })()
                : data
            onMessageRef.current?.(processed)
            setEventData((prev) => ({ ...prev, message: processed }))
        }

        return () => {
            eventSource.close()
            eventSourceRef.current = null
            listeners.clear()
        }
    }, [url, withCredentials])

    useEffect(() => {
        const eventSource = eventSourceRef.current
        if (!eventSource) return

        const currentListeners = listenersRef.current
        const newEventSet = new Set(events)

        currentListeners.forEach((handler, eventName) => {
            if (!newEventSet.has(eventName)) {
                eventSource.removeEventListener(eventName, handler)
                currentListeners.delete(eventName)
            }
        })

        events.forEach((eventName) => {
            if (!currentListeners.has(eventName)) {
                const handler = (e: MessageEvent) => {
                    const data = String(e.data)
                    const processed = parseJsonRef.current
                        ? (() => {
                              try {
                                  return JSON.parse(data) as unknown
                              } catch {
                                  return data
                              }
                          })()
                        : data
                    setEventData((prev) => ({
                        ...prev,
                        [eventName]: processed,
                    }))
                }
                eventSource.addEventListener(eventName, handler)
                currentListeners.set(eventName, handler)
            }
        })
    }, [events])

    return {
        connectionState,
        connectionError,
        eventData,
        close,
    }
}
