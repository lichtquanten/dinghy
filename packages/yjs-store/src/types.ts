import type { Snapshot } from "immer-yjs"
import type { Text } from "yjs"

export type Action = (...args: never[]) => void

export type Actions = Record<string, Action>

export type ReadOnlyStore<T extends Snapshot> = {
    get: () => T
    subscribe: (fn: () => void) => () => void
}

export type Store<T extends Snapshot, A extends Actions> = ReadOnlyStore<T> & A

export type TextAccessor = {
    ytext: () => Text
    toString: () => string
}
