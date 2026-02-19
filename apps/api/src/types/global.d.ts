export {}

declare global {
    interface CustomJwtSessionClaims {
        userId?: string
        firstName?: string
        lastName?: string
        primaryEmailAddress?: string
    }
}
