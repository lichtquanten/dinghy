const PREFIX = "pairing:"

export const PairingRoomId = {
    from: (pairingId: string): string => `${PREFIX}${pairingId}`,
    parse: (roomId: string): string | null => {
        if (!roomId.startsWith(PREFIX)) return null
        return roomId.slice(PREFIX.length)
    },
}
