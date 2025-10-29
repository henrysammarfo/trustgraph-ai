# TrustGraph - AI Agent Trust Monitoring Platform

Real-time AI agent trust monitoring platform with blockchain analysis, AI-powered behavioral analysis, and live WebSocket updates.

## Features

- **Real-time Trust Score Monitoring**: Track AI agent trustworthiness with scores from 0-100
- **Multi-chain Blockchain Integration**: Monitor transactions across Ethereum, Polygon, Arbitrum, and BSC
- **AI-Powered Analysis**: OpenAI GPT-4 powered behavioral analysis and risk detection
- **WebSocket Live Updates**: Real-time trust score, transaction, and alert notifications
- **Professional Dashboard**: SOC-style dark theme monitoring interface
- **Alert System**: Automated anomaly detection and risk alerts
- **Historical Analytics**: Track trust score trends and transaction patterns
- **Agent Detail Pages**: Deep dive into individual agent performance with charts
- **Search & Filtering**: Find agents quickly by name, address, or type
- **Analytics Dashboard**: Comprehensive insights with Recharts visualizations

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Recharts
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL (Neon)
- **Real-time**: Socket.IO for WebSocket connections
- **AI**: Vercel AI SDK with OpenAI GPT-4
- **Blockchain**: Moralis API, Alchemy
- **Caching**: In-memory caching (Redis optional for distributed setups)

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon integrated)
- OpenAI API key
- Moralis API key
- Alchemy API key
- Redis (optional - uses in-memory fallback if not provided)

### Installation

1. **Clone or download the project**
   \`\`\`bash
   # Using v0: Click "Download ZIP" or use the shadcn CLI command
   npx shadcn@latest init
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   
   Create a `.env.local` file:
   \`\`\`env
   # Database (auto-configured with Neon in v0)
   NEON_DATABASE_URL="postgresql://..."
   
   # OpenAI
   OPENAI_API_KEY="sk-proj-..."
   
   # Moralis
   MORALIS_API_KEY="eyJhbGc..."
   
   # Alchemy
   ALCHEMY_API_KEY="..."
   ALCHEMY_HTTPS_URL="https://eth-mainnet.g.alchemy.com/v2/..."
   
   # Optional: Redis (uses in-memory cache if not provided)
   KV_REST_API_URL="https://..."
   KV_REST_API_TOKEN="..."
   \`\`\`

4. **Initialize database**
   \`\`\`bash
   npx prisma generate
   npx prisma db push
   \`\`\`

5. **Run development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open the app**
   \`\`\`
   http://localhost:3000
   \`\`\`

### Optional: Redis Setup

The platform includes in-memory caching by default. For production environments with multiple instances, you can optionally add Redis:

1. Add Upstash Redis integration in v0
2. The environment variables will be automatically added
3. The platform will automatically use Redis when available, falling back to in-memory cache otherwise

**Note**: Redis is a paid service. The platform works perfectly fine without it using the built-in in-memory cache.

## Usage

### Adding an Agent

1. Navigate to the Dashboard
2. Click **Add Agent** button
3. Fill in:
   - Agent name
   - Wallet address (0x...)
   - Agent type (trading, DeFi, NFT, etc.)
   - Blockchain network
4. Click **Add Agent**

The system will automatically:
- Fetch transaction history via Moralis/Alchemy
- Calculate initial trust score
- Start real-time monitoring
- Run AI analysis every 5 minutes

### Monitoring Agents

- **Dashboard**: View all monitored agents with live trust scores
- **Agent Detail**: Click any agent to see detailed analytics, transaction history, and AI insights
- **Analytics**: Navigate to Analytics page for comprehensive platform statistics
- **Search**: Use the search bar to filter agents by name, address, or type
- **Live Updates**: Watch trust scores update in real-time via WebSocket

### Understanding Trust Scores

Trust scores range from 0-100 based on six factors:

1. **Transaction Volume** (15%): Average transaction size
2. **Transaction Frequency** (15%): Activity consistency
3. **Gas Efficiency** (15%): Optimization of gas usage
4. **Success Rate** (25%): Percentage of successful transactions
5. **Behavioral Consistency** (20%): Pattern stability
6. **Risk Level** (10%): Anomaly detection

**Score Ranges:**
- 80-100: Excellent (Green)
- 60-79: Good (Cyan)
- 40-59: Fair (Yellow)
- 0-39: Poor (Red)

## API Endpoints

### Agents
- `POST /api/agents` - Register new agent
- `GET /api/agents` - List all agents
- `GET /api/agents/:address` - Get agent details
- `GET /api/agents/:address/transactions` - Get transaction history
- `GET /api/agents/:address/trust-scores` - Get trust score history

### Analysis
- `POST /api/analyze` - Trigger manual AI analysis

### Alerts
- `GET /api/alerts` - Get active alerts
- `PATCH /api/alerts/:id` - Resolve alert

### Monitoring
- `POST /api/monitor/start` - Start monitoring agent
- `POST /api/monitor/stop` - Stop monitoring agent

### Statistics
- `GET /api/stats` - Get platform statistics

## Architecture

\`\`\`
TrustGraph/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Landing page
│   ├── dashboard/               # Dashboard routes
│   │   ├── page.tsx            # Main dashboard
│   │   ├── analytics/          # Analytics page
│   │   └── agents/[address]/   # Agent detail page
│   └── api/                     # API routes
├── components/
│   ├── dashboard/               # Dashboard components
│   └── providers/               # Context providers
├── lib/
│   ├── ai/                      # AI analysis engine
│   ├── blockchain/              # Blockchain integrations
│   ├── websocket/               # WebSocket system
│   └── redis/                   # Caching layer
├── prisma/
│   └── schema.prisma            # Database schema
└── scripts/                     # Database scripts
\`\`\`

## Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy to Vercel**
   - Click **Publish** in v0, or
   - Import project in Vercel dashboard

3. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add all required variables from `.env.local`

4. **Deploy**
   - Vercel will automatically run migrations
   - Your app will be live at `your-app.vercel.app`

### Custom Server Note

The app uses a custom Next.js server (`server.js`) for Socket.IO WebSocket support. Vercel handles this automatically.

## Customization

### Adjusting Trust Score Weights

Edit `lib/ai/analyzer.ts`:

\`\`\`typescript
const weights = {
  transactionVolume: 0.15,
  transactionFrequency: 0.15,
  gasEfficiency: 0.15,
  successRate: 0.25,
  behavioralConsistency: 0.2,
  riskLevel: 0.1,
}
\`\`\`

### Changing Analysis Frequency

Edit `lib/ai/scheduler.ts`:

\`\`\`typescript
const ANALYSIS_INTERVAL = 5 * 60 * 1000 // 5 minutes
\`\`\`

### Adding New Alert Types

Edit `lib/ai/analyzer.ts` in the `checkAndCreateAlerts` method.

## Troubleshooting

### WebSocket Not Connecting
- Ensure custom server is running (check `server.js`)
- Verify app is deployed (WebSocket requires live server)
- Check browser console for connection errors

### No Transactions Showing
- Verify wallet address format (must start with 0x)
- Ensure address has transaction history on selected chain
- Wait 30-60 seconds for initial data fetch

### AI Analysis Errors
- Verify `OPENAI_API_KEY` is set correctly
- Check API key has sufficient credits
- Review Vercel function logs for errors

### Database Connection Issues
- Ensure Neon database is connected in v0
- Run `npx prisma db push` to sync schema
- Check connection string format

## Contributing

This is a hackathon project built with v0. Feel free to fork and customize for your needs.

## License

MIT

## Support

For issues or questions:
1. Check Vercel function logs
2. Verify environment variables are set
3. Ensure API keys are valid
4. Review browser console for errors

---

Built with ❤️ using v0, Next.js, and AI
