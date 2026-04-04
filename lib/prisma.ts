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
    // Add connection pool configuration for better stability
    schema: process.env.DATABASE_SCHEMA || 'public',
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
let connectionAttempts = 0
const MAX_CONNECTION_ATTEMPTS = 3

function getPrismaInstance() {
  if (!prismaInstance) {
    try {
      prismaInstance = globalForPrisma.prisma ?? getPrismaClient()
      connectionAttempts = 0
      console.log('✅ Prisma client initialized successfully')
    } catch (error) {
      connectionAttempts++
      console.error(`❌ Failed to initialize Prisma (attempt ${connectionAttempts}/${MAX_CONNECTION_ATTEMPTS}):`, error)

      if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
        throw new Error(`Failed to connect to database after ${MAX_CONNECTION_ATTEMPTS} attempts. Check DATABASE_URL and network connectivity.`)
      }
      throw error
    }
  }
  return prismaInstance
}

// Export the function for explicit access
export function getPrisma() {
  return getPrismaInstance()
}

// For backward compatibility, use a getter that defers initialization
export const prisma = new Proxy({} as PrismaClient, {
  get: (_target, prop) => {
    const client = getPrismaInstance()
    return (client as any)[prop]
  },
})

export default prisma