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

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- Moralis API key
- Alchemy API key

### 🛠 Installation

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

For detailed deployment instructions, see `docs/DEPLOYMENT.md`.

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

## 🖥 Available Routes

- `/` - Landing page
- `/dashboard` - Main monitoring dashboard
- `/dashboard/analytics` - Analytics with interactive charts
- `/dashboard/agents/[address]` - Agent detail pages
- `/login`, `/signup` - Authentication pages
- `/beta`, `/pricing`, `/customers` - Marketing pages

## 🎯 Usage

### Working with Demo Data

The MVP comes pre-loaded with:
- 5 sample agents with realistic transaction history
- Pre-calculated trust scores
- Active alerts for monitoring

### Adding a New Agent

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

### Transaction Monitoring

Our platform tracks key metrics for each address:

1. **Transaction Volume**: Total value transferred
2. **Activity Patterns**: Transaction frequency and timing
3. **Gas Usage**: Gas efficiency analysis
4. **Success Rate**: Percentage of successful transactions
5. **Network Activity**: Cross-chain transaction history

## 🔌 API Endpoints

### Agents
- `POST /api/agents` - Register new agent
- `GET /api/agents` - List all agents
- `GET /api/agents/:address` - Get agent details
- `GET /api/agents/:address/transactions` - Get transaction history
- `GET /api/agents/:address/trust-scores` - Get trust score history

### Analysis
- `POST /api/analyze` - Trigger transaction analysis

### Alerts
- `GET /api/alerts` - Get active alerts
- `PATCH /api/alerts/:id` - Resolve alert

### Monitoring
- `POST /api/monitor/start` - Start monitoring agent
- `POST /api/monitor/stop` - Stop monitoring agent

### Statistics
- `GET /api/stats` - Get platform statistics

## 🏗 Architecture

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
│   ├── analysis/                # Transaction analysis engine
│   ├── blockchain/              # Blockchain integrations
│   ├── websocket/               # WebSocket system
│   └── redis/                   # Caching layer
├── prisma/
│   └── schema.prisma            # Database schema
└── scripts/                     # Database scripts
\`\`\`

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy to Vercel**
   - Import the project in the Vercel dashboard

3. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add all required variables from `.env.local`

4. **Deploy**
   - Vercel will automatically run migrations
   - Your app will be live at `your-app.vercel.app`

 

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
- Ensure your Neon/PostgreSQL database is reachable
- Run `npx prisma db push` to sync schema
- Verify the `DATABASE_URL` connection string format

## Contributing

This is an open project. Feel free to fork and customize for your needs.

## License

MIT

## Support

For issues or questions:
1. Check Vercel function logs
2. Verify environment variables are set
3. Ensure API keys are valid
4. Review browser console for errors

---

## Configuration

Key environment variables (see `.env.example` for the full list):

- `DATABASE_URL` – PostgreSQL connection string (Neon recommended)
- `OPENAI_API_KEY` – For AI analysis text generation
- `MORALIS_API_KEY` – Wallet transaction fetches
- `ALCHEMY_API_KEY` – Network RPC calls (optional helper)
- `JWT_SECRET` – Cookie session signing secret
- `KV_REST_API_URL` / `KV_REST_API_TOKEN` – Optional Redis (Upstash) config

Application configuration is centralized in `lib/config.ts`:

- `analysis.analysisInterval` – Analysis cadence (default 5 minutes)
- `analysis.minTransactionsForAnalysis` – Minimum tx count before scoring
- `trustScore` thresholds – Boundaries for status badges and alerts

## Running the App

Start the development server:
```bash
npm run dev
```
Visit `http://localhost:3000`.

## Monitoring & Analysis

- The blockchain monitor (`lib/blockchain/monitor.ts`) fetches wallet transactions via Moralis on a 30‑second cadence per agent and persists deduplicated results by tx hash.
- The analysis engine (`lib/ai/analyzer.ts`) computes weighted trust factors (volume, frequency, gas efficiency, success rate, consistency, risk) and produces a final score (0–100). On success it stores a `TrustScore` record, updates the agent’s `trustScore`, and emits alerts if thresholds are crossed.
- The scheduler (`lib/ai/scheduler.ts`) runs on a configurable interval, analyzing only agents with sufficient new data and time since last analysis.
- WebSocket utilities exist to broadcast trust score updates, alerts, and new transactions; the default client hook logs subscriptions and can be wired to a live Socket.IO endpoint if desired.

## API Overview

High‑level endpoints (see inline route handlers under `app/api/*` for details):

- Agents: list, create, detail, transactions, trust‑scores
- Analysis: `POST /api/analyze`
- Alerts: list and resolve
- Auth: signup, login, logout, current user
- Webhooks: Moralis stream ingestion with HMAC verification

## Security

- API keys are read from environment variables and never exposed to client‑side code
- JWT session cookies are HTTP‑only and signed with `HS256`
- Input validation and basic rate‑limiting patterns are recommended for production
- Review and rotate credentials regularly
