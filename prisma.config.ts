// prisma.config.ts
import { config } from "dotenv";
import { resolve } from "path";
import { defineConfig } from "prisma/config";

// Load .env.local file
const envPath = resolve(process.cwd(), ".env.local");
config({ path: envPath });

// Helper function to clean URL (remove surrounding quotes and any accidental variable name prefix)
function cleanUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  
  // Remove surrounding quotes
  let cleaned = url.replace(/^["']|["']$/g, "");
  
  // Remove any accidental variable name prefix (e.g., "DIRECT_URL=" or "DATABASE_URL=")
  cleaned = cleaned.replace(/^(DIRECT_URL|DATABASE_URL)\s*=\s*/i, "");
  
  // Remove any remaining surrounding quotes after cleaning
  cleaned = cleaned.replace(/^["']|["']$/g, "");
  
  return cleaned.trim();
}

// Get database URLs
const databaseUrl = cleanUrl(process.env.DATABASE_URL);
const directUrl = cleanUrl(process.env.DIRECT_URL);

// Validate required environment variable
if (!directUrl) {
  throw new Error(
    `DIRECT_URL is required for Prisma migrations. Please set it in your .env.local file.`
  );
}

// Validate URL format - must start with postgresql:// or postgres://
if (!directUrl.startsWith('postgresql://') && !directUrl.startsWith('postgres://')) {
  throw new Error(
    `DIRECT_URL must start with 'postgresql://' or 'postgres://'. Current value: ${directUrl ? `"${directUrl.substring(0, 50)}..."` : 'undefined'}\n` +
    `Please check your .env.local file and ensure DIRECT_URL is properly formatted.\n` +
    `Example: DIRECT_URL="postgresql://user:password@host:5432/database?sslmode=require"`
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use DIRECT_URL for migrations (session pooler for IPv4 compatibility)
    url: directUrl,
  },
});