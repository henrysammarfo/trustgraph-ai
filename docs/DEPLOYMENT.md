# Vercel Deployment Guide

## Step 1: Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub account
3. Click "New Project"
4. Select `trustgraph-ai` repository
5. Click "Import"

## Step 2: Configure Project

1. **Project name:** `trustgraph-ai`
2. **Framework:** Next.js (auto-detected)
3. **Root directory:** `./` (default)
4. Click "Continue"

## Step 3: Set Environment Variables

In Vercel dashboard:

1. Go to Settings → Environment Variables
2. Add each variable:

\`\`\`
NEON_NEON_DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_URL=https://trustgraph-ai.vercel.app
\`\`\`

3. Click "Save"

## Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Visit deployment URL

## Step 5: Verify Deployment

- [ ] Landing page loads
- [ ] Signup page works
- [ ] Login page works
- [ ] Dashboard loads
- [ ] All features functional

## Step 6: Configure Custom Domain (Optional)

1. Go to Settings → Domains
2. Add custom domain
3. Update DNS records
4. Verify domain

---

## Continuous Deployment

Every push to `main` branch automatically deploys:

\`\`\`bash
git push origin main
# Vercel automatically builds and deploys
\`\`\`

---

## Monitoring Deployment

1. Go to Deployments tab
2. View build logs
3. Check performance metrics
4. Monitor errors

---

## Rollback (if needed)

1. Go to Deployments
2. Find previous deployment
3. Click "Redeploy"

---

## Next Steps

✅ Live deployment on Vercel
→ **Next:** Follow `docs/DEMO_GUIDE.md`
