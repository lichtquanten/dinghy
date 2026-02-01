import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { Spinner } from "@workspace/ui/components/spinner.js"

const LOADING_MESSAGES = ["Loading..."] as const

export function LoadingSpinner() {
    const [messageIndex, setMessageIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length)
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex flex-col items-center gap-6">
            <Spinner className="size-16 text-primary" />
            <div className="h-8 flex items-center justify-center min-w-75">
                <motion.p
                    key={messageIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-muted-foreground text-lg font-medium"
                >
                    {LOADING_MESSAGES[messageIndex]}
                </motion.p>
            </div>
        </div>
    )
}
