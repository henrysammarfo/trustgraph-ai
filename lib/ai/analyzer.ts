import { generateText } from "ai"
import { prisma } from "@/lib/prisma"
import { config } from "@/lib/config"
import type { TrustScoreFactors } from "@/lib/types"
import { formatWeiToEth, calculateGasCost } from "@/lib/blockchain/utils"
import OpenAI from "openai"

export const openai = new OpenAI({
  apiKey: config.openai.apiKey,
})

export class AITrustAnalyzer {
  async analyzeAgent(agentId: string): Promise<{
    score: number
    factors: TrustScoreFactors
    analysis: string
    confidence: number
  }> {
    console.log(`[v0] Starting AI analysis for agent: ${agentId}`)

    // Fetch agent and recent transactions
    const agent = await prisma.aIAgent.findUnique({
      where: { id: agentId },
      include: {
        transactions: {
          orderBy: { timestamp: "desc" },
          take: 100,
        },
        trustScores: {
          orderBy: { timestamp: "desc" },
          take: 5,
        },
        alerts: {
          where: { resolved: false },
        },
      },
    })

    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`)
    }

    if (agent.transactions.length < config.analysis.minTransactionsForAnalysis) {
      console.log(`[v0] Insufficient transactions for analysis: ${agent.transactions.length}`)
      return {
        score: 50,
        factors: this.getDefaultFactors(),
        analysis: "Insufficient transaction history for comprehensive analysis.",
        confidence: 0.3,
      }
    }

    // Calculate trust score factors
    const factors = this.calculateTrustFactors(agent.transactions)

    // Generate AI analysis
    const aiAnalysis = await this.generateAIAnalysis(agent, factors)

    // Calculate final trust score
    const score = this.calculateFinalScore(factors, aiAnalysis.riskLevel)

    // Store trust score
    await prisma.trustScore.create({
      data: {
        agentId,
        score,
        factors,
        analysis: aiAnalysis.analysis,
        confidence: aiAnalysis.confidence,
      },
    })

    // Update agent trust score
    await prisma.aIAgent.update({
      where: { id: agentId },
      data: { trustScore: score },
    })

    // Check for alerts
    await this.checkAndCreateAlerts(agentId, score, factors, aiAnalysis)

    console.log(`[v0] Analysis complete for agent ${agentId}: score=${score}`)

    return {
      score,
      factors,
      analysis: aiAnalysis.analysis,
      confidence: aiAnalysis.confidence,
    }
  }

  private calculateTrustFactors(transactions: any[]): TrustScoreFactors {
    if (transactions.length === 0) {
      return this.getDefaultFactors()
    }

    // Transaction Volume Score (0-100)
    const totalValue = transactions.reduce((sum, tx) => {
      const value = Number.parseFloat(formatWeiToEth(tx.value))
      return sum + value
    }, 0)
    const avgValue = totalValue / transactions.length
    const transactionVolume = Math.min(100, (avgValue / 10) * 100) // Normalize to 0-100

    // Transaction Frequency Score (0-100)
    const timeSpan =
      transactions.length > 1
        ? (transactions[0].timestamp.getTime() - transactions[transactions.length - 1].timestamp.getTime()) /
          (1000 * 60 * 60 * 24)
        : 1
    const txPerDay = transactions.length / Math.max(timeSpan, 1)
    const transactionFrequency = Math.min(100, (txPerDay / 10) * 100) // Normalize to 0-100

    // Gas Efficiency Score (0-100)
    const avgGasCost =
      transactions.reduce((sum, tx) => {
        if (tx.gasUsed && tx.gasPrice) {
          const cost = Number.parseFloat(calculateGasCost(tx.gasUsed, tx.gasPrice))
          return sum + cost
        }
        return sum
      }, 0) / transactions.length
    const gasEfficiency = Math.max(0, 100 - avgGasCost * 1000) // Lower gas cost = higher score

    // Success Rate Score (0-100)
    const successCount = transactions.filter((tx) => tx.status === "success").length
    const successRate = (successCount / transactions.length) * 100

    // Behavioral Consistency Score (0-100)
    const valueStdDev = this.calculateStandardDeviation(
      transactions.map((tx) => Number.parseFloat(formatWeiToEth(tx.value))),
    )
    const behavioralConsistency = Math.max(0, 100 - valueStdDev * 10) // Lower deviation = higher consistency

    // Risk Level Score (0-100, lower is better)
    const failedTxCount = transactions.filter((tx) => tx.status === "failed").length
    const failureRate = (failedTxCount / transactions.length) * 100
    const riskLevel = Math.min(100, failureRate * 2) // Higher failure rate = higher risk

    return {
      transactionVolume: Math.round(transactionVolume),
      transactionFrequency: Math.round(transactionFrequency),
      gasEfficiency: Math.round(gasEfficiency),
      successRate: Math.round(successRate),
      behavioralConsistency: Math.round(behavioralConsistency),
      riskLevel: Math.round(riskLevel),
    }
  }

  private async generateAIAnalysis(
    agent: any,
    factors: TrustScoreFactors,
  ): Promise<{
    analysis: string
    riskLevel: number
    confidence: number
  }> {
    const recentTxs = agent.transactions.slice(0, 10)
    const txSummary = recentTxs.map((tx: any) => ({
      value: formatWeiToEth(tx.value),
      status: tx.status,
      timestamp: tx.timestamp.toISOString(),
    }))

    const prompt = `You are an AI agent trust analysis expert. Analyze the following blockchain agent behavior and provide a comprehensive trust assessment.

Agent Information:
- Name: ${agent.name}
- Type: ${agent.type}
- Address: ${agent.address}
- Total Transactions: ${agent.transactions.length}
- Current Trust Score: ${agent.trustScore}

Trust Score Factors:
- Transaction Volume: ${factors.transactionVolume}/100
- Transaction Frequency: ${factors.transactionFrequency}/100
- Gas Efficiency: ${factors.gasEfficiency}/100
- Success Rate: ${factors.successRate}/100
- Behavioral Consistency: ${factors.behavioralConsistency}/100
- Risk Level: ${factors.riskLevel}/100

Recent Transactions (last 10):
${JSON.stringify(txSummary, null, 2)}

Active Alerts: ${agent.alerts.length}

Provide a detailed analysis covering:
1. Overall trustworthiness assessment
2. Key behavioral patterns observed
3. Potential risks or concerns
4. Recommendations for monitoring

Keep the analysis concise but comprehensive (3-5 sentences).`

    try {
      const { text } = await generateText({
        model: "openai/gpt-4.1",
        prompt,
        maxTokens: 500,
      })

      // Calculate confidence based on data quality
      const confidence = Math.min(0.95, 0.5 + (agent.transactions.length / 200) * 0.45)

      // Extract risk level from factors
      const riskLevel = factors.riskLevel

      return {
        analysis: text,
        riskLevel,
        confidence,
      }
    } catch (error) {
      console.error("[v0] AI analysis error:", error)
      return {
        analysis: "AI analysis temporarily unavailable. Trust score calculated based on transaction metrics.",
        riskLevel: factors.riskLevel,
        confidence: 0.6,
      }
    }
  }

  private calculateFinalScore(factors: TrustScoreFactors, riskLevel: number): number {
    // Weighted average of all factors
    const weights = {
      transactionVolume: 0.15,
      transactionFrequency: 0.15,
      gasEfficiency: 0.15,
      successRate: 0.25,
      behavioralConsistency: 0.2,
      riskLevel: 0.1, // Inverse weight (lower risk = higher score)
    }

    const score =
      factors.transactionVolume * weights.transactionVolume +
      factors.transactionFrequency * weights.transactionFrequency +
      factors.gasEfficiency * weights.gasEfficiency +
      factors.successRate * weights.successRate +
      factors.behavioralConsistency * weights.behavioralConsistency +
      (100 - factors.riskLevel) * weights.riskLevel

    return Math.max(0, Math.min(100, Math.round(score)))
  }

  private async checkAndCreateAlerts(agentId: string, score: number, factors: TrustScoreFactors, aiAnalysis: any) {
    const alerts: Array<{
      type: string
      severity: string
      message: string
      details: any
    }> = []

    // Critical trust score
    if (score < config.trustScore.critical) {
      alerts.push({
        type: "critical",
        severity: "critical",
        message: `Trust score critically low: ${score}/100`,
        details: { score, factors },
      })
    }

    // Low success rate
    if (factors.successRate < 70) {
      alerts.push({
        type: "risk",
        severity: "high",
        message: `Low transaction success rate: ${factors.successRate}%`,
        details: { successRate: factors.successRate },
      })
    }

    // High risk level
    if (factors.riskLevel > 50) {
      alerts.push({
        type: "risk",
        severity: "high",
        message: `High risk level detected: ${factors.riskLevel}/100`,
        details: { riskLevel: factors.riskLevel },
      })
    }

    // Behavioral anomaly
    if (factors.behavioralConsistency < 50) {
      alerts.push({
        type: "anomaly",
        severity: "medium",
        message: `Inconsistent transaction behavior detected`,
        details: { behavioralConsistency: factors.behavioralConsistency },
      })
    }

    // Create alerts in database
    for (const alert of alerts) {
      await prisma.alert.create({
        data: {
          agentId,
          type: alert.type,
          severity: alert.severity,
          message: alert.message,
          details: alert.details,
        },
      })
    }

    if (alerts.length > 0) {
      console.log(`[v0] Created ${alerts.length} alerts for agent ${agentId}`)
    }
  }

  private calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length
    const squareDiffs = values.map((val) => Math.pow(val - avg, 2))
    const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / values.length
    return Math.sqrt(avgSquareDiff)
  }

  private getDefaultFactors(): TrustScoreFactors {
    return {
      transactionVolume: 50,
      transactionFrequency: 50,
      gasEfficiency: 50,
      successRate: 50,
      behavioralConsistency: 50,
      riskLevel: 50,
    }
  }
}

export const aiTrustAnalyzer = new AITrustAnalyzer()
export const trustAnalyzer = aiTrustAnalyzer
