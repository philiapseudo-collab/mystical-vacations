import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 * 
 * Prevents "Too Many Connections" errors during Next.js hot-reloading.
 * 
 * In development, the module is cached, but during hot-reloads, new instances
 * can be created. This singleton pattern ensures we reuse the same client.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

