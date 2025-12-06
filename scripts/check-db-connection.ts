#!/usr/bin/env tsx
/**
 * Check Database Connection Configuration
 * 
 * This script helps verify that your database connection strings are set up correctly
 * for Prisma migrations and runtime.
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local
const envPath = resolve(process.cwd(), ".env.local");
config({ path: envPath });

function cleanUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.replace(/^["']|["']$/g, "");
}

const directUrl = cleanUrl(process.env.DIRECT_URL);
const databaseUrl = cleanUrl(process.env.DATABASE_URL);

console.log('\n🔍 Database Connection Configuration Check\n');

// Check DATABASE_URL
if (databaseUrl) {
  const isPooled = databaseUrl.includes(':6543') || databaseUrl.includes('pooler') || databaseUrl.includes('pgbouncer=true');
  console.log('✅ DATABASE_URL is set');
  console.log(`   Type: ${isPooled ? 'Pooled (port 6543) ✅ Good for app runtime' : 'Direct (port 5432)'}`);
  console.log(`   Host: ${new URL(databaseUrl).hostname}`);
} else {
  console.log('❌ DATABASE_URL is not set');
}

// Check DIRECT_URL
if (directUrl) {
  const isPooled = directUrl.includes(':6543') || directUrl.includes('pooler') || directUrl.includes('pgbouncer=true');
  console.log('✅ DIRECT_URL is set');
  console.log(`   Type: ${isPooled ? '⚠️  Pooled (port 6543) - NOT suitable for migrations!' : 'Direct (port 5432) ✅ Good for migrations'}`);
  console.log(`   Host: ${new URL(directUrl).hostname}`);
  
  if (isPooled) {
    console.log('\n❌ ERROR: DIRECT_URL should use port 5432 (direct connection), not 6543 (pooled).');
    console.log('   Migrations will timeout with a pooled connection.');
    console.log('   See FIX_MIGRATION_TIMEOUT.md for instructions.\n');
    process.exit(1);
  }
} else {
  console.log('⚠️  DIRECT_URL is not set');
  console.log('   Migrations will use DATABASE_URL as fallback.');
  
  if (databaseUrl) {
    const isPooled = databaseUrl.includes(':6543') || databaseUrl.includes('pooler') || databaseUrl.includes('pgbouncer=true');
    if (isPooled) {
      console.log('\n❌ ERROR: DATABASE_URL is pooled, but DIRECT_URL is not set.');
      console.log('   Migrations will timeout. Please set DIRECT_URL to use port 5432.');
      console.log('   See FIX_MIGRATION_TIMEOUT.md for instructions.\n');
      process.exit(1);
    }
  }
}

console.log('\n✅ Configuration looks good!\n');

