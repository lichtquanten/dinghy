import type { getPairingDoc } from "./doc"

export type { PairingState } from "./types"
export { getPairingDoc } from "./doc"
export type PairingDoc = ReturnType<typeof getPairingDoc>
export { PairingRoomId } from "./roomId"
export { useStore, useStoreSelector } from "@workspace/yjs-store"
