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

if (!migrationUrl) {
  // Only throw in development - Vercel will have env vars set
  if (process.env.NODE_ENV === "development") {
    throw new Error(
      "DATABASE_URL or DIRECT_URL is required. Please set it in your .env.local file."
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