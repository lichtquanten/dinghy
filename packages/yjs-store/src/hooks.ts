import type { Snapshot } from "immer-yjs"
import { useSyncExternalStore } from "react"
import type { ReadOnlyStore } from "./types"

export function useStore<T extends Snapshot>(store: ReadOnlyStore<T>): T {
    return useSyncExternalStore(store.subscribe, store.get, store.get)
}

export function useStoreSelector<T extends Snapshot, R>(
    store: ReadOnlyStore<T>,
    selector: (state: T) => R
): R {
    return useSyncExternalStore(
        store.subscribe,
        () => selector(store.get()),
        () => selector(store.get())
    )
}
