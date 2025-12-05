/**
 * Safe Prisma Client Accessor
 * 
 * This module provides a safe way to access Prisma Client even if initialization fails.
 * Returns null if Prisma is not available, allowing code to continue without database.
 */

import type { PrismaClient } from "@prisma/client";

let prismaClient: PrismaClient | null = null;
let initializationError: Error | null = null;

/**
 * Get Prisma Client safely - returns null if unavailable
 */
export function getPrismaClient(): PrismaClient | null {
  if (prismaClient) {
    return prismaClient;
  }
  
  if (initializationError) {
    // Already tried and failed
    return null;
  }
  
  // Try to initialize
  try {
    // Dynamic import to catch initialization errors
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const prismaModule = require('./prisma');
    prismaClient = prismaModule.prisma;
    return prismaClient;
  } catch (error) {
    initializationError = error instanceof Error ? error : new Error(String(error));
    console.error('⚠️ Prisma Client not available:', initializationError.message);
    return null;
  }
}

/**
 * Check if Prisma is available
 */
export function isPrismaAvailable(): boolean {
  return getPrismaClient() !== null;
}

