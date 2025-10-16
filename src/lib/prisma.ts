// lib/prisma.ts
import { PrismaClient } from "@prisma/client"

declare global {
  // Evita múltiples instancias de Prisma en modo dev (hot reload)
  // @ts-ignore
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // opcional: logs de prisma
  })

if (process.env.NODE_ENV !== "production") global.prisma = prisma
