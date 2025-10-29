# AI Analysis System Documentation

## Overview

The TrustGraph AI Monitor includes a comprehensive AI-powered trust analysis system that evaluates blockchain agents based on their transaction behavior and generates trust scores with detailed insights.

## Architecture

### Core Components

1. **AITrustAnalyzer** (`lib/ai/analyzer.ts`)
   - Main analysis engine
   - Calculates trust score factors
   - Generates AI-powered insights using GPT-4
   - Creates alerts for suspicious behavior

2. **AnalysisScheduler** (`lib/ai/scheduler.ts`)
   - Automated periodic analysis
   - Runs every 5 minutes (configurable)
   - Analyzes all active agents with new transactions
   - Prevents redundant analysis

3. **BlockchainMonitor** (`lib/blockchain/monitor.ts`)
   - Fetches transactions from Moralis API
   - Monitors agents every 30 seconds
   - Stores new transactions in database
   - Marks transactions for analysis

## Trust Score Calculation

### Factors (0-100 scale)

1. **Transaction Volume** (15% weight)
   - Average transaction value
   - Higher volume = higher score
   - Normalized to 0-100 scale

2. **Transaction Frequency** (15% weight)
   - Transactions per day
   - Consistent activity = higher score
   - Normalized to 0-100 scale

3. **Gas Efficiency** (15% weight)
   - Average gas cost per transaction
   - Lower gas cost = higher score
   - Indicates optimization and efficiency

4. **Success Rate** (25% weight)
   - Percentage of successful transactions
   - Most important factor
   - Direct indicator of reliability

5. **Behavioral Consistency** (20% weight)
   - Standard deviation of transaction values
   - Lower deviation = higher consistency
   - Detects erratic behavior

6. **Risk Level** (10% weight, inverse)
   - Based on failure rate
   - Higher risk = lower score
   - Triggers alerts when elevated

### Final Score Formula

\`\`\`
score = (transactionVolume × 0.15) +
        (transactionFrequency × 0.15) +
        (gasEfficiency × 0.15) +
        (successRate × 0.25) +
        (behavioralConsistency × 0.20) +
        ((100 - riskLevel) × 0.10)
\`\`\`

## AI-Powered Analysis

### GPT-4 Integration

The system uses OpenAI's GPT-4 to generate comprehensive trust assessments:

- **Input**: Agent metadata, trust factors, recent transactions, active alerts
- **Output**: Detailed analysis covering:
  - Overall trustworthiness assessment
  - Key behavioral patterns
  - Potential risks or concerns
  - Monitoring recommendations

### Confidence Scoring

Confidence increases with data quality:
- Minimum: 0.5 (50 transactions)
- Maximum: 0.95 (200+ transactions)
- Formula: `0.5 + (txCount / 200) × 0.45`

## Alert System

### Alert Types

1. **Critical Trust Score**
   - Triggered when score < 30
   - Severity: Critical
   - Requires immediate attention

2. **Low Success Rate**
   - Triggered when success rate < 70%
   - Severity: High
   - Indicates reliability issues

3. **High Risk Level**
   - Triggered when risk level > 50
   - Severity: High
   - Potential security concern

4. **Behavioral Anomaly**
   - Triggered when consistency < 50
   - Severity: Medium
   - Unusual transaction patterns

### Alert Management

- Alerts stored in database with timestamps
- Can be resolved manually or automatically
- Displayed in dashboard with severity indicators
- WebSocket notifications for real-time updates

## API Endpoints

### Manual Analysis Trigger

\`\`\`typescript
POST /api/analyze
Body: { agentAddress: string }
Response: {
  message: string
  result: {
    score: number
    factors: TrustScoreFactors
    analysis: string
    confidence: number
  }
}
\`\`\`

### Usage Example

\`\`\`typescript
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ agentAddress: '0x...' })
})

const { result } = await response.json()
console.log(`Trust Score: ${result.score}`)
console.log(`Analysis: ${result.analysis}`)
\`\`\`

## Automated Scheduling

### Configuration

Default settings in `lib/config.ts`:

\`\`\`typescript
analysis: {
  analysisInterval: 5 * 60 * 1000, // 5 minutes
  minTransactionsForAnalysis: 10,
}
\`\`\`

### Scheduler Behavior

1. Runs every 5 minutes
2. Fetches all active agents
3. Checks if analysis needed:
   - Has minimum transactions (10+)
   - Has new transactions since last analysis
   - Enough time passed since last analysis
4. Performs analysis and stores results
5. Emits WebSocket events for UI updates

### Starting the Scheduler

The scheduler is automatically started when the application initializes. To manually control:

\`\`\`typescript
import { analysisScheduler } from '@/lib/ai/scheduler'

// Start automated analysis
analysisScheduler.start()

// Stop automated analysis
analysisScheduler.stop()

// Trigger immediate analysis
await analysisScheduler.analyzeAgentNow(agentId)
\`\`\`

## Database Schema

### TrustScore Table

\`\`\`prisma
model TrustScore {
  id         String   @id @default(cuid())
  agentId    String
  agent      AIAgent  @relation(fields: [agentId], references: [id])
  score      Int
  factors    Json
  analysis   String
  confidence Float
  timestamp  DateTime @default(now())
}
\`\`\`

### Alert Table

\`\`\`prisma
model Alert {
  id        String   @id @default(cuid())
  agentId   String
  agent     AIAgent  @relation(fields: [agentId], references: [id])
  type      String
  severity  String
  message   String
  details   Json
  resolved  Boolean  @default(false)
  timestamp DateTime @default(now())
}
\`\`\`

## Performance Considerations

### Optimization Strategies

1. **Batch Processing**
   - Analyzes multiple agents in sequence
   - Prevents API rate limiting
   - Reduces database load

2. **Caching**
   - Stores analysis results in database
   - Avoids redundant calculations
   - Improves response times

3. **Incremental Analysis**
   - Only analyzes agents with new data
   - Skips recently analyzed agents
   - Reduces computational overhead

4. **Error Handling**
   - Graceful degradation on AI failures
   - Fallback to metric-based scoring
   - Continues processing other agents

## Monitoring and Debugging

### Console Logs

The system provides detailed logging:

\`\`\`
[v0] Starting AI analysis for agent: {agentId}
[v0] Fetched {count} transactions for {address}
[v0] Analysis complete for agent {agentId}: score={score}
[v0] Created {count} alerts for agent {agentId}
\`\`\`

### Common Issues

1. **Insufficient Transactions**
   - Minimum 10 transactions required
   - Returns default score of 50
   - Low confidence (0.3)

2. **AI API Failures**
   - Falls back to metric-based analysis
   - Returns generic analysis message
   - Maintains confidence at 0.6

3. **Database Connection Issues**
   - Logs error and continues
   - Skips problematic agent
   - Retries on next cycle

## Future Enhancements

### Planned Features

1. **Machine Learning Models**
   - Train custom models on historical data
   - Improve prediction accuracy
   - Reduce dependency on external APIs

2. **Advanced Pattern Detection**
   - Identify complex fraud patterns
   - Detect coordinated attacks
   - Recognize emerging threats

3. **Comparative Analysis**
   - Benchmark against similar agents
   - Industry-specific scoring
   - Peer comparison metrics

4. **Real-time Streaming**
   - Analyze transactions as they occur
   - Instant alert generation
   - Sub-second response times

## Testing

### End-to-End Test

Run the complete system test:

\`\`\`bash
curl -X POST http://localhost:3000/api/test/e2e
\`\`\`

This will:
1. Create a test agent
2. Add sample transactions
3. Run AI analysis
4. Verify trust score calculation
5. Check alert generation

### Unit Testing

Test individual components:

\`\`\`typescript
import { aiTrustAnalyzer } from '@/lib/ai/analyzer'

// Test analysis
const result = await aiTrustAnalyzer.analyzeAgent(agentId)
expect(result.score).toBeGreaterThan(0)
expect(result.score).toBeLessThanOrEqual(100)
\`\`\`

## Security Considerations

1. **API Key Protection**
   - OpenAI API key stored in environment variables
   - Never exposed to client-side code
   - Rotated regularly

2. **Rate Limiting**
   - Prevents abuse of analysis endpoint
   - Throttles automated requests
   - Protects against DoS attacks

3. **Data Validation**
   - Validates all input parameters
   - Sanitizes transaction data
   - Prevents injection attacks

4. **Access Control**
   - Requires authentication for manual analysis
   - Role-based permissions
   - Audit logging for sensitive operations

## Support

For issues or questions:
- Check console logs for detailed error messages
- Review database for stored analysis results
- Verify environment variables are set correctly
- Contact support at vercel.com/help
