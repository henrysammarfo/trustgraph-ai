# TrustGraph AI - Architecture Overview

## System Architecture

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: React hooks + Context API
- **Real-time Updates**: Polling (5-second intervals)

### Backend
- **Runtime**: Next.js API Routes
- **Database**: Neon PostgreSQL
- **Authentication**: JWT-based with secure cookies
- **Blockchain Integration**: Ethers.js for Web3 interactions

### Key Features
1. **Real-time Agent Monitoring** - Track AI agents across multiple blockchains
2. **AI-Powered Analysis** - GPT-4 trust score calculations
3. **Alert System** - Automated alerts for anomalies
4. **Multi-chain Support** - Ethereum, Polygon, Arbitrum, Optimism, Base
5. **Enterprise Dashboard** - Real-time analytics and reporting

## Database Schema

### Core Tables
- `users` - User accounts and authentication
- `agents` - Monitored AI agents
- `transactions` - Agent transaction history
- `alerts` - System alerts and notifications
- `analysis_results` - AI analysis and trust scores

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Agents
- `GET /api/agents` - List user's agents
- `POST /api/agents` - Add new agent
- `GET /api/agents/:address` - Get agent details
- `DELETE /api/agents/:address` - Remove agent

### Analysis
- `POST /api/analyze` - Trigger AI analysis
- `GET /api/analysis/:agentId` - Get analysis results

### Alerts
- `GET /api/alerts` - List alerts
- `PATCH /api/alerts/:id` - Resolve alert

## Deployment

### Vercel Deployment
1. Connect GitHub repository
2. Set environment variables (see `.env.example`)
3. Deploy automatically on push to main

### Environment Variables Required
- `NEON_NEON_DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_API_URL` - Frontend API endpoint
- `JWT_SECRET` - Session encryption key
