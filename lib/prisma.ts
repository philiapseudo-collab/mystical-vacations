import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client Singleton for Next.js
 * 
 * Prevents "Too Many Connections" errors during development hot-reloading.
 * Compatible with Prisma 7.x and Vercel serverless functions.
 */

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" 
      ? ["query", "error", "warn"] 
      : ["error"],
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export { prisma };

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}