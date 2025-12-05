# 🔧 Fix DATABASE_URL Error in Vercel

## The Problem

You're seeing this error:
```
Invalid `prisma.order.findUnique()` invocation: error: Error validating datasource `db`: 
the URL must start with the protocol `postgresql://` or `postgres://`
```

This means your `DATABASE_URL` in Vercel is either:
1. **Wrapped in quotes** (most common)
2. **Empty or undefined**
3. **Has extra whitespace**

## ✅ Solution

### Step 1: Go to Vercel Environment Variables

1. Open your Vercel dashboard
2. Go to your project: **mystical-vacations-web**
3. Click **Settings** → **Environment Variables**
4. Find `DATABASE_URL`

### Step 2: Update DATABASE_URL

**❌ WRONG** (with quotes):
```
"postgresql://postgres.nfkvhithhutrommzfigz:W7u4C8hZnAwxA9xI@aws-1-eu-central-1.pooler.supabase.com:6543/postgres"
```

**✅ CORRECT** (no quotes):
```
postgresql://postgres.nfkvhithhutrommzfigz:W7u4C8hZnAwxA9xI@aws-1-eu-central-1.pooler.supabase.com:6543/postgres
```

### Step 3: Verify the Format

The URL should:
- ✅ Start with `postgresql://` (no quotes before it)
- ✅ Not have quotes around the entire value
- ✅ Not have extra spaces before or after
- ✅ Use port `6543` (Transaction Pooler for Vercel)

### Step 4: Save and Redeploy

1. Click **Save** on the environment variable
2. Go to **Deployments** tab
3. Click the **three dots** (⋯) on the latest deployment
4. Click **Redeploy**
5. Wait for deployment to complete

### Step 5: Test

1. Go to your test payment page
2. Try making a payment
3. The error should be gone!

## 🔍 How to Check if it's Fixed

After redeploying, check the Vercel function logs:
1. Go to **Deployments** → Click on the latest deployment
2. Click **Functions** tab
3. Look for any Prisma errors - they should be gone
4. You should see: `✅ Cleaned DATABASE_URL (removed quotes/whitespace)` in the logs

## 📝 Complete DATABASE_URL Value

Copy and paste this **exactly** (replace `[YOUR-PASSWORD]` if needed):

```
postgresql://postgres.nfkvhithhutrommzfigz:W7u4C8hZnAwxA9xI@aws-1-eu-central-1.pooler.supabase.com:6543/postgres
```

**Make sure:**
- No quotes (`"`) at the beginning or end
- No spaces before or after
- The value starts immediately with `postgresql://`

## 🚨 Still Having Issues?

If you're still seeing errors after updating:

1. **Double-check for hidden characters:**
   - Delete the entire value in Vercel
   - Type it fresh (don't copy-paste from a document with formatting)
   - Or copy directly from Supabase connection string

2. **Verify in Supabase:**
   - Go to your Supabase project
   - Settings → Database → Connection String
   - Select **Transaction pooler** (port 6543)
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with: `W7u4C8hZnAwxA9xI`

3. **Check all environments:**
   - Make sure `DATABASE_URL` is set for:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development

4. **Redeploy after changes:**
   - Environment variable changes require a redeploy
   - Don't just update and test - you must redeploy!

