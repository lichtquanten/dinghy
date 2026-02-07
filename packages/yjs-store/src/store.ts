import { bind, type Snapshot } from "immer-yjs"
import type { Doc } from "yjs"
import type { Actions, Store } from "./types"

export function createStoreFactory<T extends Snapshot, A extends Actions>(
    key: string,
    actions: (update: (fn: (draft: T) => void) => void) => A
) {
    return (doc: Doc): Store<T, A> => {
        const binder = bind<T>(doc.getMap(key))
        return {
            get: binder.get,
            subscribe: binder.subscribe,
            ...actions(binder.update),
        }
    }
}
