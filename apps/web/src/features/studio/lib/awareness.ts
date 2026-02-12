import type { Awareness } from "../contexts/YjsContext"

type UserState = {
    id: string
    name: string
    color: string
    colorLight: string
}

interface AwarenessState {
    user?: UserState
}

export interface AwarenessStore {
    setUser(user: UserState): void
    isOnline(userId: string): boolean
    getStates(): AwarenessState[]
    subscribe(callback: () => void): () => void
}

export function createAwarenessStore(awareness: Awareness): AwarenessStore {
    function getStates(): AwarenessState[] {
        return Array.from(awareness.getStates().values()) as AwarenessState[]
    }

    return {
        setUser(user: UserState) {
            awareness.setLocalStateField("user", user)
        },

        isOnline(userId: string) {
            return getStates().some((s) => s.user?.id === userId)
        },

        getStates,

        subscribe(callback: () => void) {
            awareness.on("change", callback)
            return () => awareness.off("change", callback)
        },
    }
}
