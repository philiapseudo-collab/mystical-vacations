import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client Singleton for Next.js
 * 
 * Prevents "Too Many Connections" errors during development hot-reloading.
 * Compatible with Prisma 7.x and Vercel serverless functions.
 * 
 * Handles DATABASE_URL cleaning and validation.
 */

// Clean DATABASE_URL - remove quotes and validate format
function ensureCleanDatabaseUrl(): void {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    return; // Will be caught by Prisma validation
  }
  
  // Remove surrounding quotes and whitespace
  const cleaned = databaseUrl.trim().replace(/^["']|["']$/g, '');
  
  // Only update if it changed
  if (cleaned !== databaseUrl) {
    process.env.DATABASE_URL = cleaned;
    console.log('✅ Cleaned DATABASE_URL (removed quotes/whitespace)');
  }
  
  // Validate format for better error messages
  if (cleaned && !cleaned.match(/^postgres(ql)?:\/\//)) {
    console.error('❌ Invalid DATABASE_URL format. It must start with postgresql:// or postgres://');
    console.error('Current DATABASE_URL starts with:', cleaned.substring(0, 50));
    console.error('Please check your Vercel environment variables - remove any quotes around the URL.');
  }
}

// Clean DATABASE_URL before Prisma initialization
ensureCleanDatabaseUrl();

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" 
      ? ["query", "error", "warn"] 
      : ["error"],
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
} & typeof global;

let prisma: ReturnType<typeof prismaClientSingleton>;

try {
  prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
  
  if (process.env.NODE_ENV !== "production") {
    globalThis.prismaGlobal = prisma;
  }
} catch (error) {
  console.error('❌ Prisma Client initialization failed:', error);
  // Re-throw to fail fast - this will be caught by API route error handlers
  throw error;
}

export { prisma };