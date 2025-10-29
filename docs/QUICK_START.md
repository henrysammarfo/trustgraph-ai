# Quick Start Guide

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL (via Neon)
- Git

### Setup Steps

1. **Clone and Install**
   \`\`\`bash
   git clone <repo-url>
   cd trustgraph-monitor
   npm install
   \`\`\`

2. **Environment Setup**
   \`\`\`bash
   cp .env.example .env.local
   # Add your Neon database URL and other env vars
   \`\`\`

3. **Database Setup**
   \`\`\`bash
   npm run db:setup
   \`\`\`

4. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`
   Visit http://localhost:3000

## User Journey

### New User
1. Land on homepage
2. Click "Get Started"
3. Create account (email/password)
4. Redirected to dashboard
5. Click "Add Agent"
6. Enter wallet address
7. Start monitoring

### Returning User
1. Go to login page
2. Enter credentials
3. View dashboard with existing agents
4. Monitor real-time data
5. View alerts and analytics

## Testing the Product

### Demo Credentials
- Email: `demo@trustgraph.ai`
- Password: `Demo123!@#`

### Test Agents
- Ethereum: `0x1234...` (demo agent)
- Polygon: `0x5678...` (demo agent)

## Troubleshooting

### Dashboard Not Loading
- Clear browser cache
- Check environment variables
- Verify database connection

### Agents Not Updating
- Check blockchain RPC endpoints
- Verify agent addresses are valid
- Check alert logs for errors

## Next Steps
See `CLAUDE_NEXT_STEPS.md` for detailed implementation guide.
