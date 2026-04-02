// src/lib/prisma.ts

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

function getPrismaClient() {
  // During build, DATABASE_URL might not be set - return a dummy client
  if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL) {
      // During Vercel build, create a dummy client that won't be used
      console.warn('DATABASE_URL not set during build - creating dummy Prisma client')
      return new PrismaClient({
        log: [],
      })
    }
    throw new Error('DATABASE_URL is not set in environment variables')
  }

  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  })

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error', 'warn'],
  })
}

// Lazy-load Prisma client - only initialize when first accessed
let prismaInstance: PrismaClient | undefined

export function getPrisma() {
  if (!prismaInstance) {
    prismaInstance = globalForPrisma.prisma ?? getPrismaClient()
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prismaInstance
    }
  }
  return prismaInstance
}

// For backward compatibility, export as getter
export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    const client = getPrisma()
    return (client as any)[prop]
  },
})

export default prisma