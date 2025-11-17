import { motion } from "motion/react"

export function ErrorFallback() {
    return (
        <div className="flex-1 flex items-center justify-center bg-background">
            <motion.div
                className="text-center space-y-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <p className="text-destructive text-lg font-semibold">
                    Failed to load your data
                </p>
                <p className="text-muted-foreground mt-2">
                    Please check your connection and try again
                </p>
            </motion.div>
        </div>
    )
}
