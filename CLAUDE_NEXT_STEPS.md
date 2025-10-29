# TrustGraph AI Monitor - Claude AI Implementation Guide (10 Hours)

## CRITICAL: Current Status & Blockers

### ✅ What's Working
- Landing page (beautiful, loads perfectly)
- Package.json cleaned (removed problematic dependencies)
- Database schema created (Neon PostgreSQL)
- API routes structure in place
- AI analysis system designed

### ❌ Critical Blockers to Fix (Priority Order)
1. **Import errors blocking all pages** - lucide-react, swr, date-fns still imported in components
2. **Dashboard not loading** - SWR import errors in dashboard components
3. **Auth flow incomplete** - Signup/login don't actually create users or set sessions
4. **No real data** - Dashboard shows mock data, not real agent monitoring
5. **WebSocket/real-time broken** - Socket.io removed, need polling alternative

---

## PHASE 1: Fix Critical Import Errors (1 Hour)

### Step 1.1: Remove ALL lucide-react imports
**Files to fix:**
- `app/dashboard/agents/[address]/page.tsx`
- `app/dashboard/analytics/page.tsx`
- `components/dashboard/add-agent-dialog.tsx`
- `components/dashboard/header.tsx`
- `components/dashboard/transaction-map.tsx`
- `components/dashboard/agent-comparison.tsx`
- `components/waitlist-form.tsx`
- `app/pricing/page.tsx`
- `app/about/page.tsx`
- `app/customers/page.tsx`
- `app/beta/page.tsx`
- `app/terms/page.tsx`
- `app/privacy/page.tsx`
- `app/contact/page.tsx`

**Action:** Replace all lucide-react icons with inline SVG components or Unicode symbols. Example:
\`\`\`tsx
// REMOVE: import { Shield, TrendingUp } from 'lucide-react'
// ADD: Inline SVG or use Unicode
const ShieldIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 1L2 4v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V4l-8-3z"/>
  </svg>
)
\`\`\`

### Step 1.2: Remove SWR imports from dashboard components
**Files to fix:**
- `components/dashboard/stats-overview.tsx`
- `components/dashboard/agent-grid.tsx`
- `components/dashboard/alert-panel.tsx`
- `components/dashboard/analytics-charts.tsx`

**Action:** Replace SWR with simple useState + useEffect with fetch:
\`\`\`tsx
// REMOVE: import useSWR from 'swr'
// ADD:
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetch('/api/agents')
    .then(r => r.json())
    .then(d => setData(d))
    .finally(() => setLoading(false))
}, [])
\`\`\`

### Step 1.3: Remove date-fns imports
**Files to fix:**
- `components/dashboard/live-feed.tsx`
- `components/dashboard/alert-panel.tsx`

**Action:** Use native JavaScript Date methods:
\`\`\`tsx
// REMOVE: import { formatDistanceToNow } from 'date-fns'
// ADD:
const formatTime = (date) => {
  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return \`\${minutes}m ago\`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return \`\${hours}h ago\`
  return new Date(date).toLocaleDateString()
}
\`\`\`

---

## PHASE 2: Implement Authentication (2 Hours)

### Step 2.1: Create auth API routes
**Create:** `app/api/auth/signup/route.ts`
\`\`\`typescript
import { neon } from '@neondatabase/serverless'

export async function POST(req: Request) {
  const { email, password, name } = await req.json()
  
  if (!email || !password || !name) {
    return Response.json({ error: 'Missing fields' }, { status: 400 })
  }

  const sql = neon(process.env.NEON_DATABASE_URL!)
  
  try {
    // Hash password (use bcrypt if available, else simple hash)
    const hashedPassword = Buffer.from(password).toString('base64')
    
    const result = await sql(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name]
    )
    
    return Response.json({ user: result[0] }, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'User already exists' }, { status: 409 })
  }
}
\`\`\`

**Create:** `app/api/auth/login/route.ts`
\`\`\`typescript
import { neon } from '@neondatabase/serverless'

export async function POST(req: Request) {
  const { email, password } = await req.json()
  
  const sql = neon(process.env.DATABASE_URL!)
  
  try {
    const hashedPassword = Buffer.from(password).toString('base64')
    
    const result = await sql(
      'SELECT id, email, name FROM users WHERE email = $1 AND password = $2',
      [email, hashedPassword]
    )
    
    if (result.length === 0) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    // Set session cookie
    const response = Response.json({ user: result[0] })
    response.headers.set('Set-Cookie', \`userId=\${result[0].id}; Path=/; HttpOnly\`)
    return response
  } catch (error) {
    return Response.json({ error: 'Login failed' }, { status: 500 })
  }
}
\`\`\`

### Step 2.2: Update signup/login pages to call API
**Update:** `app/signup/page.tsx`
\`\`\`tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  
  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    })
    
    if (res.ok) {
      router.push('/dashboard')
    } else {
      setError('Signup failed')
    }
  } finally {
    setLoading(false)
  }
}
\`\`\`

---

## PHASE 3: Implement Agent Monitoring (2 Hours)

### Step 3.1: Create agent API routes
**Create:** `app/api/agents/route.ts`
\`\`\`typescript
import { neon } from '@neondatabase/serverless'

export async function GET(req: Request) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  
  const sql = neon(process.env.DATABASE_URL!)
  const agents = await sql(
    'SELECT * FROM agents WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  )
  
  return Response.json(agents)
}

export async function POST(req: Request) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  
  const { address, blockchain } = await req.json()
  
  const sql = neon(process.env.DATABASE_URL!)
  const result = await sql(
    'INSERT INTO agents (user_id, address, blockchain) VALUES ($1, $2, $3) RETURNING *',
    [userId, address, blockchain]
  )
  
  return Response.json(result[0], { status: 201 })
}
\`\`\`

### Step 3.2: Create monitoring job
**Create:** `app/api/monitor/route.ts`
\`\`\`typescript
import { neon } from '@neondatabase/serverless'

export async function POST(req: Request) {
  const sql = neon(process.env.DATABASE_URL!)
  
  // Get all active agents
  const agents = await sql('SELECT * FROM agents WHERE active = true')
  
  for (const agent of agents) {
    // Fetch blockchain data (example with Etherscan)
    const response = await fetch(
      \`https://api.etherscan.io/api?module=account&action=txlist&address=\${agent.address}&apikey=\${process.env.ETHERSCAN_API_KEY}\`
    )
    const data = await response.json()
    
    // Store transaction data
    if (data.result && data.result.length > 0) {
      const latestTx = data.result[0]
      await sql(
        'INSERT INTO transactions (agent_id, tx_hash, status) VALUES ($1, $2, $3)',
        [agent.id, latestTx.hash, latestTx.isError === '0' ? 'success' : 'failed']
      )
    }
  }
  
  return Response.json({ success: true })
}
\`\`\`

---

## PHASE 4: Implement Real-Time Updates (1.5 Hours)

### Step 4.1: Replace WebSocket with polling
**Update:** `components/dashboard/live-feed.tsx`
\`\`\`tsx
useEffect(() => {
  const fetchUpdates = async () => {
    const res = await fetch('/api/live-feed')
    const data = await res.json()
    setFeed(data)
  }
  
  fetchUpdates()
  const interval = setInterval(fetchUpdates, 5000) // Poll every 5 seconds
  
  return () => clearInterval(interval)
}, [])
\`\`\`

### Step 4.2: Create live-feed API
**Create:** `app/api/live-feed/route.ts`
\`\`\`typescript
import { neon } from '@neondatabase/serverless'

export async function GET(req: Request) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  
  const sql = neon(process.env.DATABASE_URL!)
  
  const events = await sql(\`
    SELECT t.*, a.address, a.blockchain
    FROM transactions t
    JOIN agents a ON t.agent_id = a.id
    WHERE a.user_id = $1
    ORDER BY t.created_at DESC
    LIMIT 20
  \`, [userId])
  
  return Response.json(events)
}
\`\`\`

---

## PHASE 5: Implement AI Analysis (1.5 Hours)

### Step 5.1: Create analysis API
**Create:** `app/api/analyze/route.ts`
\`\`\`typescript
import { generateText } from 'ai'

export async function POST(req: Request) {
  const { agentAddress, transactions } = await req.json()
  
  const { text } = await generateText({
    model: 'openai/gpt-4-mini',
    prompt: \`Analyze this AI agent's blockchain activity and provide a trust score (0-100) and risk assessment:
    
    Agent Address: \${agentAddress}
    Recent Transactions: \${JSON.stringify(transactions)}
    
    Provide:
    1. Trust Score (0-100)
    2. Risk Level (Low/Medium/High/Critical)
    3. Key Findings (2-3 bullet points)
    4. Recommendations
    \`
  })
  
  return Response.json({ analysis: text })
}
\`\`\`

---

## PHASE 6: Testing & Verification (1.5 Hours)

### Testing Checklist
- [ ] Landing page loads without errors
- [ ] Signup form works and creates user in database
- [ ] Login form works and authenticates user
- [ ] Dashboard loads after login
- [ ] Can add new agent (modal works)
- [ ] Agent appears in dashboard
- [ ] Live feed shows transactions
- [ ] Alerts display correctly
- [ ] Analytics page loads
- [ ] AI analysis generates insights
- [ ] All pages have consistent styling
- [ ] Mobile responsive design works

### Debug Commands
\`\`\`bash
# Check database connection
curl http://localhost:3000/api/health

# Test signup
curl -X POST http://localhost:3000/api/auth/signup \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Test login
curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@example.com","password":"test123"}'

# Test agent creation
curl -X POST http://localhost:3000/api/agents \\
  -H "Content-Type: application/json" \\
  -H "x-user-id: 1" \\
  -d '{"address":"0x1234...","blockchain":"ethereum"}'
\`\`\`

---

## PHASE 7: Deployment (1 Hour)

### Deploy to Vercel
\`\`\`bash
# 1. Push to GitHub
git add .
git commit -m "MVP ready for deployment"
git push origin main

# 2. Connect to Vercel
vercel link

# 3. Set environment variables
vercel env add DATABASE_URL
vercel env add ETHERSCAN_API_KEY
vercel env add OPENAI_API_KEY

# 4. Deploy
vercel deploy --prod
\`\`\`

### Post-Deployment
- [ ] Test all pages on live URL
- [ ] Verify database connection
- [ ] Check API endpoints
- [ ] Monitor error logs
- [ ] Test auth flow end-to-end

---

## PHASE 8: Live Demo Script (30 Minutes)

### Demo Flow (5 minutes)
1. **Landing Page** (30 sec)
   - Show value proposition
   - Highlight key features
   - Click "Get Started"

2. **Signup** (1 min)
   - Create account with demo email
   - Show form validation
   - Redirect to dashboard

3. **Dashboard** (2 min)
   - Show empty state
   - Click "Add Agent"
   - Enter wallet address (0x1234567890123456789012345678901234567890)
   - Show agent added
   - Show live feed updating
   - Show alerts panel

4. **Analytics** (1 min)
   - Navigate to analytics
   - Show charts and metrics
   - Highlight AI insights

5. **Closing** (30 sec)
   - Show pricing page
   - Emphasize competitive advantage
   - Call to action

---

## Critical Environment Variables Needed

\`\`\`
DATABASE_URL=postgresql://...
ETHERSCAN_API_KEY=...
OPENAI_API_KEY=...
NEXT_PUBLIC_APP_URL=https://trustgraph.vercel.app
\`\`\`

---

## Troubleshooting Guide

### Issue: "Module not found" errors
**Solution:** Remove the import and replace with inline implementation

### Issue: Database connection fails
**Solution:** Verify DATABASE_URL is set correctly in Vercel environment

### Issue: Auth not working
**Solution:** Check that cookies are being set correctly in browser DevTools

### Issue: Real-time updates not showing
**Solution:** Verify polling interval is working (check Network tab in DevTools)

### Issue: AI analysis not generating
**Solution:** Verify OPENAI_API_KEY is set and has available credits

---

## Final Checklist Before Submission

- [ ] All pages load without errors
- [ ] Auth flow works end-to-end
- [ ] Dashboard displays real data
- [ ] Live demo script tested
- [ ] GitHub repo is clean and organized
- [ ] README is comprehensive
- [ ] PITCH_DECK.md is complete
- [ ] SUBMISSION_PACKAGE.md is filled out
- [ ] Environment variables documented
- [ ] Deployment tested on Vercel
- [ ] Live demo URL working
- [ ] All team member info added
- [ ] Travel plan confirmed

---

## Success Criteria

✅ **MVP Complete When:**
1. User can sign up → login → dashboard without errors
2. Can add agents and see monitoring data
3. Live feed updates in real-time
4. AI analysis generates insights
5. All pages styled consistently
6. Live demo works smoothly
7. Code is clean and documented
8. Deployed to production URL

**Time Estimate:** 10 hours total
**Current Time:** 10 hours remaining
**Status:** ON TRACK ✅
