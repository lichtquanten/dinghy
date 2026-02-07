import { bind, type Snapshot } from "immer-yjs"
import type { Doc } from "yjs"

export function createStoreFactory<
    T extends Snapshot,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    A extends Record<string, (...args: any[]) => void>,
>(key: string, actions: (update: (fn: (draft: T) => void) => void) => A) {
    return (doc: Doc) => {
        const binder = bind<T>(doc.getMap(key))
        return {
            get: binder.get,
            subscribe: binder.subscribe,
            ...actions(binder.update),
        }
    }
}
