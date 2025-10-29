# TrustGraph

TrustGraph is an operations console for monitoring autonomous agent activity across public blockchains. The platform combines on-chain telemetry, statistical scoring, and operational alerting to help security teams evaluate agent behavior in real time.

## Table of Contents

1. [Key Capabilities](#key-capabilities)
2. [Technology Stack](#technology-stack)
3. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
4. [Deployment](#deployment)
5. [API Documentation](#api-documentation)
6. [Contributing](#contributing)
7. [License](#license)

## Key Capabilities

- **Trust Scoring Engine** – Normalizes on-chain behavior into a 0–100 trust score using weighted metrics
- **Multi-Chain Coverage** – Monitors transactions across Ethereum, Polygon, Arbitrum, and BNB Smart Chain
- **Live Telemetry** – Real-time updates for trust scores, transactions, and alerts
- **Alert System** – Automated detection of anomalies and suspicious activities
- **Analyst Workflows** – Detailed agent views, historical charts, and comparison tools
- **Analytics Suite** – Comprehensive statistics and trend visualizations

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript 5
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Data Layer**: Prisma ORM, PostgreSQL (Neon)
- **Real-time**: Socket.IO
- **Visualization**: Recharts
- **Blockchain**: Moralis Web3 API, Alchemy RPC
- **Caching**: In-memory with Redis support caching (Redis optional for distributed setups)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- Moralis API key
- Alchemy API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/trustgraph.git
   cd trustgraph
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   npx tsx scripts/seed.ts
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Vercel Deployment

1. Push your code to a Git repository
2. Import the repository into Vercel
3. Configure environment variables in the Vercel dashboard
4. Deploy

For detailed deployment instructions, see our [Deployment Guide](DEPLOYMENT.md).

## API Documentation

The TrustGraph API provides endpoints for:

- Agent management
- Transaction monitoring
- Alert handling
- Analytics and reporting

Refer to [API.md](API.md) for complete documentation.

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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
