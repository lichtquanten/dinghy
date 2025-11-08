// roles.decorator.ts
const roleMetadataKey = Symbol("roles")

export function roles(allowed: string[]) {
    return (target: object, propertyKey: string | symbol) => {
        Reflect.defineMetadata(roleMetadataKey, allowed, target, propertyKey)
    }
}

export function filterByRole<T extends object>(
    obj: T,
    role: string
): Partial<T> {
    const result: Partial<T> = {}
    for (const key of Object.keys(obj) as (keyof T & (string | symbol))[]) {
        const allowed = Reflect.getMetadata(roleMetadataKey, obj, key) as
            | string[]
            | undefined

        if (!allowed || allowed.includes(role)) {
            ;(result as Record<keyof T, T[keyof T]>)[key] = obj[key]
        }
    }
    return result
}
