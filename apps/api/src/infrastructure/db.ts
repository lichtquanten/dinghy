import { PrismaClient } from "@workspace/db/client"

export const prisma: PrismaClient = new PrismaClient()

await prisma.$connect()

export async function disconnect() {
    await prisma.$disconnect()
}

let lastCheck = 0
let lastResult = false
let pending: Promise<boolean> | null = null
const CACHE_TTL = 5000

export async function getIsDbConnected(): Promise<boolean> {
    const now = Date.now()
    if (now - lastCheck < CACHE_TTL) {
        return lastResult
    }

    if (pending) return pending

    pending = (async () => {
        try {
            await prisma.$runCommandRaw({ ping: 1 })
            lastResult = true
        } catch {
            lastResult = false
        } finally {
            lastCheck = Date.now()
            pending = null
        }
        return lastResult
    })()

    return pending
}
