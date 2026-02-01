import { useAtomValue, useSetAtom } from "jotai"
import { useEffect } from "react"
import {
    firstReadyAtAtom,
    startTimeAtom,
    timeElapsedAtom,
    timeoutRemainingAtom,
} from "../atoms"

export function useStudioTimer() {
    const startTime = useAtomValue(startTimeAtom)
    const firstReadyAt = useAtomValue(firstReadyAtAtom)
    const setTimeElapsed = useSetAtom(timeElapsedAtom)
    const setTimeoutRemaining = useSetAtom(timeoutRemainingAtom)

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeElapsed(Math.floor((Date.now() - startTime) / 1000))
        }, 1000)
        return () => clearInterval(interval)
    }, [startTime, setTimeElapsed])

    useEffect(() => {
        if (!firstReadyAt) {
            setTimeoutRemaining(null)
            return
        }

        const timeoutSecs = 30
        const updateTimeout = () => {
            const remaining = Math.max(
                0,
                timeoutSecs - Math.floor((Date.now() - firstReadyAt) / 1000)
            )
            setTimeoutRemaining(remaining)
        }

        updateTimeout()
        const interval = setInterval(updateTimeout, 1000)
        return () => clearInterval(interval)
    }, [firstReadyAt, setTimeoutRemaining])
}
