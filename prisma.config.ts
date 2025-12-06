// prisma.config.ts
import { config } from "dotenv";
import { resolve } from "path";
import { defineConfig } from "prisma/config";

// Load .env.local file (for local development)
const envPath = resolve(process.cwd(), ".env.local");
config({ path: envPath });

// Helper function to clean URL (remove surrounding quotes if present)
function cleanUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.replace(/^["']|["']$/g, "");
}

// Get database URL - use DIRECT_URL for migrations, DATABASE_URL as fallback
const directUrl = cleanUrl(process.env.DIRECT_URL);
const databaseUrl = cleanUrl(process.env.DATABASE_URL);

// Use DIRECT_URL for migrations (direct connection without pgbouncer)
// Fall back to DATABASE_URL if DIRECT_URL is not set
const migrationUrl = directUrl || databaseUrl;

// Check if using pooled connection (will cause timeout errors)
if (migrationUrl) {
  const isPooledConnection = 
    migrationUrl.includes(':6543') || 
    migrationUrl.includes('pooler') || 
    migrationUrl.includes('pgbouncer=true');
  
  if (isPooledConnection && !directUrl) {
    console.warn('⚠️  WARNING: Migrations are using a pooled connection (port 6543).');
    console.warn('⚠️  This will cause timeout errors. Please set DIRECT_URL to use port 5432.');
    console.warn('⚠️  See FIX_MIGRATION_TIMEOUT.md for instructions.');
  }
}

if (!migrationUrl) {
  // Only throw in development - Vercel will have env vars set
  if (process.env.NODE_ENV === "development") {
    throw new Error(
      "DATABASE_URL or DIRECT_URL is required. Please set it in your .env.local file.\n" +
      "For Supabase: Use DIRECT_URL with port 5432 for migrations, DATABASE_URL with port 6543 for app."
    );
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: migrationUrl || "",
  },
});