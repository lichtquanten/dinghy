import { PrismaClient } from "@workspace/db/client"

export const prisma: PrismaClient = new PrismaClient()

await prisma.$connect()

export async function disconnect() {
    await prisma.$disconnect()
}
