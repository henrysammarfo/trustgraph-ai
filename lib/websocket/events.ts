import { wsServer } from "./server"
import { prisma } from "@/lib/prisma"

export class WebSocketEventEmitter {
  async emitTrustScoreUpdate(agentId: string) {
    try {
      const agent = await prisma.aIAgent.findUnique({
        where: { id: agentId },
        include: {
          trustScores: {
            orderBy: { timestamp: "desc" },
            take: 1,
          },
        },
      })

      if (!agent) return

      const latestScore = agent.trustScores[0]

      wsServer.broadcastTrustScoreUpdate(agent.address, {
        agentId: agent.id,
        agentAddress: agent.address,
        agentName: agent.name,
        trustScore: agent.trustScore,
        previousScore: latestScore ? latestScore.score : null,
        factors: latestScore ? latestScore.factors : null,
        timestamp: new Date(),
      })
    } catch (error) {
      console.error("[v0] Error emitting trust score update:", error)
    }
  }

  async emitNewTransaction(transactionId: string) {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
        include: {
          agent: true,
        },
      })

      if (!transaction) return

      wsServer.broadcastNewTransaction(transaction.agent.address, {
        transactionId: transaction.id,
        hash: transaction.hash,
        agentId: transaction.agent.id,
        agentAddress: transaction.agent.address,
        agentName: transaction.agent.name,
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
        status: transaction.status,
        chainId: transaction.chainId,
        timestamp: transaction.timestamp,
      })
    } catch (error) {
      console.error("[v0] Error emitting new transaction:", error)
    }
  }

  async emitAlert(alertId: string) {
    try {
      const alert = await prisma.alert.findUnique({
        where: { id: alertId },
        include: {
          agent: true,
        },
      })

      if (!alert) return

      wsServer.broadcastAlert(alert.agent.address, {
        alertId: alert.id,
        agentId: alert.agent.id,
        agentAddress: alert.agent.address,
        agentName: alert.agent.name,
        type: alert.type,
        severity: alert.severity,
        message: alert.message,
        details: alert.details,
        timestamp: alert.createdAt,
      })
    } catch (error) {
      console.error("[v0] Error emitting alert:", error)
    }
  }

  async emitAgentStatusChange(agentId: string, newStatus: string) {
    try {
      const agent = await prisma.aIAgent.findUnique({
        where: { id: agentId },
      })

      if (!agent) return

      wsServer.broadcastAgentStatus(agent.address, {
        agentId: agent.id,
        agentAddress: agent.address,
        agentName: agent.name,
        status: newStatus,
        trustScore: agent.trustScore,
        timestamp: new Date(),
      })
    } catch (error) {
      console.error("[v0] Error emitting agent status change:", error)
    }
  }
}

export const wsEventEmitter = new WebSocketEventEmitter()
