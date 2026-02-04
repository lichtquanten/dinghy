import "yjs"

declare module "yjs" {
    interface Text {
        toString(): string
    }
}
