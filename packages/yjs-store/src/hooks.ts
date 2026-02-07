import { useSyncExternalStore } from "react"

type Store<T> = {
    get: () => T
    subscribe: (fn: () => void) => () => void
}

export function useStore<T>(store: Store<T>): T {
    return useSyncExternalStore(store.subscribe, store.get, store.get)
}

export function useStoreSelector<T, R>(
    store: Store<T>,
    selector: (state: T) => R
): R {
    return useSyncExternalStore(
        store.subscribe,
        () => selector(store.get()),
        () => selector(store.get())
    )
}
