import { prisma } from "@/lib/prisma"
import { aiTrustAnalyzer } from "./analyzer"
import { config } from "@/lib/config"

export class AnalysisScheduler {
  private isRunning = false
  private interval: NodeJS.Timeout | null = null

  start() {
    if (this.isRunning) {
      console.log("[v0] Analysis scheduler already running")
      return
    }

    console.log("[v0] Starting analysis scheduler")
    this.isRunning = true

    // Run immediately
    this.runAnalysis()

    // Schedule periodic analysis
    this.interval = setInterval(() => {
      this.runAnalysis()
    }, config.analysis.analysisInterval)
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    this.isRunning = false
    console.log("[v0] Analysis scheduler stopped")
  }

  private async runAnalysis() {
    try {
      console.log("[v0] Running scheduled analysis")

      // Get all active agents
      const agents = await prisma.aIAgent.findMany({
        where: { status: "active" },
        include: {
          transactions: {
            take: 1,
            orderBy: { timestamp: "desc" },
          },
          trustScores: {
            take: 1,
            orderBy: { timestamp: "desc" },
          },
        },
      })

      console.log(`[v0] Found ${agents.length} active agents to analyze`)

      // Analyze each agent
      for (const agent of agents) {
        try {
          // Check if agent needs analysis
          const needsAnalysis = this.shouldAnalyze(agent)

          if (needsAnalysis) {
            console.log(`[v0] Analyzing agent: ${agent.name} (${agent.address})`)
            await aiTrustAnalyzer.analyzeAgent(agent.id)
          }
        } catch (error) {
          console.error(`[v0] Error analyzing agent ${agent.id}:`, error)
        }
      }

      console.log("[v0] Scheduled analysis complete")
    } catch (error) {
      console.error("[v0] Error in scheduled analysis:", error)
    }
  }

  private shouldAnalyze(agent: any): boolean {
    // Always analyze if no trust scores exist
    if (!agent.trustScores || agent.trustScores.length === 0) {
      return agent.transactions.length >= config.analysis.minTransactionsForAnalysis
    }

    // Check if enough time has passed since last analysis
    const lastAnalysis = agent.trustScores[0]
    const timeSinceLastAnalysis = Date.now() - lastAnalysis.timestamp.getTime()
    const shouldReanalyze = timeSinceLastAnalysis >= config.analysis.analysisInterval

    // Check if there are new transactions since last analysis
    const hasNewTransactions = agent.transactions.length > 0 && agent.transactions[0].timestamp > lastAnalysis.timestamp

    return shouldReanalyze && hasNewTransactions
  }

  async analyzeAgentNow(agentId: string) {
    console.log(`[v0] Manual analysis triggered for agent: ${agentId}`)
    return aiTrustAnalyzer.analyzeAgent(agentId)
  }
}

export const analysisScheduler = new AnalysisScheduler()
