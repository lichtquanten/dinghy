// src/components/ConnectionStatus.tsx
import { Badge } from "@workspace/ui/components/badge.tsx"

interface ConnectionStatusProps {
    isConnected: boolean
}

export const ConnectionStatus = ({ isConnected }: ConnectionStatusProps) => {
    return (
        <Badge
            variant={isConnected ? "default" : "destructive"}
            className="gap-2"
        >
            <div
                className={`w-2 h-2 rounded-full animate-pulse ${
                    isConnected ? "bg-green-400" : "bg-red-400"
                }`}
            />
            {isConnected ? "Connected" : "Disconnected"}
        </Badge>
    )
}
