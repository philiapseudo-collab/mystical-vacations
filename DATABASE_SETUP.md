# Database Setup for Vercel + Supabase

## ✅ Correct DATABASE_URL Configuration

Based on your Supabase setup, use the **Transaction Pooler** connection string for Vercel serverless functions.

### Transaction Pooler (Recommended for Vercel)
```
postgresql://postgres.nfkvhithhutrommzfigz:W7u4C8hZnAwxA9xI@aws-1-eu-central-1.pooler.supabase.com:6543/postgres
```

**Key points:**
- Port: **6543** (Transaction pooler)
- Host: `aws-1-eu-central-1.pooler.supabase.com`
- Ideal for serverless/Vercel functions
- Each interaction is brief and isolated

## 📋 Steps to Configure in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Find or create `DATABASE_URL`
4. Paste the connection string above (without quotes)
5. Make sure it's set for **Production**, **Preview**, and **Development** environments
6. **Redeploy** your application after adding/updating the variable

## ⚠️ Important Notes

- **Do NOT** add quotes around the connection string in Vercel
- The URL must start with `postgresql://` (Prisma requirement)
- If you see errors about invalid DATABASE_URL format, check that there are no extra quotes or spaces
- Transaction pooler does NOT support PREPARE statements, which is fine for Prisma queries

## 🔧 Testing the Connection

After setting up DATABASE_URL, test it by:
1. Visiting the test payment page: `/test-payment`
2. Completing a test payment
3. Check Vercel logs to see if orders are being saved to the database

## 🐛 Troubleshooting

### Error: "the URL must start with the protocol `postgresql://` or `postgres://`"

**Solution:**
1. Check that DATABASE_URL in Vercel doesn't have quotes around it
2. Verify the URL starts with `postgresql://`
3. Make sure there are no spaces before/after the URL

### Error: Connection timeout or connection refused

**Solution:**
1. Verify you're using the Transaction Pooler (port 6543), not Direct Connection
2. Check that your Supabase project is active
3. Verify your IP is allowed in Supabase (if IP restrictions are enabled)

## 📊 Database Schema

The application uses the following Prisma models:
- **Order** - Payment transactions
- **Booking** - Travel bookings
- **SGRTicket** - Standard Gauge Railway tickets

All migrations are located in `prisma/migrations/`

