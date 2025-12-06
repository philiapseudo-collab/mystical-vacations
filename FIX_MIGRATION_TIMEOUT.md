# Fix Prisma Migration Timeout Error

## Problem
The error `P1002: The database server was reached but timed out` occurs because Prisma migrations are trying to use a **pooled connection** (port 6543) which doesn't support advisory locks required for migrations.

## Solution

### For Supabase:
You need **two different connection strings**:

1. **DATABASE_URL** - Pooled connection (for app runtime)
   - Port: `6543` (pgbouncer)
   - Use this for your application

2. **DIRECT_URL** - Direct connection (for migrations)
   - Port: `5432` (direct PostgreSQL)
   - Use this for `prisma migrate deploy`

### Steps to Fix:

1. **Get your Supabase connection strings:**
   - Go to your Supabase project dashboard
   - Navigate to Settings → Database
   - You'll see two connection strings:
     - **Connection pooling** (port 6543) → Use for `DATABASE_URL`
     - **Direct connection** (port 5432) → Use for `DIRECT_URL`

2. **Update your `.env.local` file:**
   ```env
   # Pooled connection (for app)
   DATABASE_URL="postgresql://user:password@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   
   # Direct connection (for migrations)
   DIRECT_URL="postgresql://user:password@aws-1-eu-central-1.pooler.supabase.com:5432/postgres"
   ```

3. **Important Notes:**
   - Remove any quotes around the URLs in `.env.local`
   - The `DIRECT_URL` should use port `5432` (not 6543)
   - The `DATABASE_URL` can use port `6543` with `?pgbouncer=true`

4. **Run migrations again:**
   ```bash
   npx prisma migrate deploy
   ```

## Alternative: Use Direct Connection for Both

If you're having issues, you can temporarily use the direct connection for both:

```env
DATABASE_URL="postgresql://user:password@host:5432/postgres"
DIRECT_URL="postgresql://user:password@host:5432/postgres"
```

**Note:** This works but you'll lose connection pooling benefits for your app.

## Verification

After setting `DIRECT_URL`, the migration should work. The `prisma.config.ts` file is already configured to use `DIRECT_URL` for migrations.

