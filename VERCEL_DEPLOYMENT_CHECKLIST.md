# 🚀 Vercel Deployment Checklist

This document outlines all the steps and requirements for deploying Mystical Vacations to Vercel.

## ✅ Pre-Deployment Checks

### Build Status
- ✅ TypeScript compilation: **PASSING**
- ✅ Production build: **PASSING**
- ✅ All routes generated successfully

### Code Quality
- ✅ No TypeScript errors
- ✅ No linting errors (ESLint config present)
- ✅ All imports resolved correctly

## 🔐 Required Environment Variables

Set these in your Vercel project settings (Settings → Environment Variables):

### Database (Required)
```
DATABASE_URL=postgresql://user:password@host:port/database
DIRECT_URL=postgresql://user:password@host:port/database
```
**Note:** 
- `DATABASE_URL` is used for Prisma Client (can use connection pooling)
- `DIRECT_URL` is used for migrations (direct connection, no pooling)
- Remove any quotes around the URLs in Vercel
- Both should point to the same database

### PesaPal Payment Integration (Required for payments)
```
PESAPAL_CONSUMER_KEY=your_consumer_key
PESAPAL_CONSUMER_SECRET=your_consumer_secret
PESAPAL_ENV=sandbox|live
PESAPAL_IPN_ID=your_ipn_id
```

### Application URLs (Required)
```
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_API_URL=https://your-api-url.com/api
```

**Note:** 
- `NEXT_PUBLIC_APP_URL` is used for payment callbacks
- Set this to your production domain after deployment
- Update it when you add a custom domain

### Optional
```
NODE_ENV=production
```

## 📋 Vercel Configuration

### Build Settings
The project uses the following build configuration (already set in `vercel.json`):

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

**Important:** The `postinstall` script in `package.json` automatically runs `prisma generate` after `npm install`, so Prisma Client will be generated during Vercel's build process.

### Function Configuration
API routes are configured with a 30-second timeout:
- All routes in `app/api/**/*.ts` have `maxDuration: 30`

### Regions
- Default region: `iad1` (US East)

## 🗄️ Database Setup

### Prisma Migrations
Before deploying, ensure your database is set up:

1. **Run migrations locally first:**
   ```bash
   npx prisma migrate deploy
   ```

2. **Or let Vercel run migrations:**
   - Add a build command that includes migrations:
   ```json
   "buildCommand": "prisma migrate deploy && prisma generate && next build"
   ```
   - **Note:** This is optional. You can also run migrations manually after deployment.

### Database Connection
- The app uses Prisma with PostgreSQL
- Connection pooling is recommended for serverless (use `DATABASE_URL` with pooling)
- Direct connection is used for migrations (use `DIRECT_URL`)

## 🔍 Post-Deployment Verification

After deployment, verify:

1. **Homepage loads:** `https://your-app.vercel.app`
2. **API routes work:** Check `/api/packages`, `/api/excursions`, etc.
3. **Database connection:** Test any page that uses Prisma
4. **Payment flow:** Test the booking flow (if PesaPal is configured)
5. **Environment variables:** Verify all are set correctly in Vercel dashboard

## 🐛 Common Issues & Solutions

### Issue: "Prisma Client not generated"
**Solution:** 
- Ensure `postinstall` script is in `package.json` ✅ (Already present)
- Check that `prisma generate` runs during build

### Issue: "DATABASE_URL not found"
**Solution:**
- Verify environment variables are set in Vercel
- Check that URLs don't have quotes around them
- Ensure both `DATABASE_URL` and `DIRECT_URL` are set

### Issue: "Payment callbacks not working"
**Solution:**
- Set `NEXT_PUBLIC_APP_URL` to your production domain
- Update PesaPal IPN settings to point to: `https://your-app.vercel.app/api/webhooks/pesapal`

### Issue: "Build fails with TypeScript errors"
**Solution:**
- All TypeScript errors have been fixed ✅
- Run `npm run build` locally to verify before deploying

### Issue: "API routes timeout"
**Solution:**
- Current timeout is 30 seconds (configured in `vercel.json`)
- For longer operations, consider using Vercel's background functions

## 📝 Deployment Steps

1. **Push code to GitHub/GitLab/Bitbucket**
2. **Import project in Vercel:**
   - Go to https://vercel.com/new
   - Import your repository
   - Vercel will auto-detect Next.js

3. **Configure environment variables:**
   - Go to Project Settings → Environment Variables
   - Add all required variables listed above
   - Set them for Production, Preview, and Development

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Check build logs for any errors

5. **Run database migrations:**
   ```bash
   npx prisma migrate deploy
   ```
   Or use Vercel's CLI:
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

6. **Verify deployment:**
   - Check all pages load correctly
   - Test API endpoints
   - Verify database connections

## 🔄 Continuous Deployment

Vercel automatically deploys on:
- Push to main/master branch (production)
- Pull requests (preview deployments)

Make sure to:
- Keep environment variables in sync across environments
- Test preview deployments before merging
- Monitor build logs for any issues

## 📚 Additional Resources

- [Vercel Next.js Documentation](https://vercel.com/docs/frameworks/nextjs)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Last Updated:** 2025-12-05
**Build Status:** ✅ Ready for Deployment

