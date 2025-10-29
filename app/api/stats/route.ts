import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const DEMO_STATS = {
  stats: {
    totalAgents: 3,
    activeAgents: 3,
    totalTransactions: 4206,
    activeAlerts: 7,
    avgTrustScore: 86.2,
    recentTransactions: 342,
    recentAlerts: 2,
  },
  trustDistribution: {
    excellent: 2,
    good: 1,
    fair: 0,
    poor: 0,
  },
  transactionTrend: [
    { date: "Jan 15", count: 45 },
    { date: "Jan 16", count: 52 },
    { date: "Jan 17", count: 48 },
    { date: "Jan 18", count: 61 },
    { date: "Jan 19", count: 55 },
    { date: "Jan 20", count: 58 },
    { date: "Jan 21", count: 63 },
  ],
  alertsBySeverity: [
    { severity: "low", count: 3 },
    { severity: "medium", count: 3 },
    { severity: "high", count: 1 },
  ],
  topAgents: [
    { name: "NFT Marketplace Bot", trustScore: 92.3 },
    { name: "DeFi Trading Agent", trustScore: 87.5 },
    { name: "Yield Optimizer", trustScore: 78.9 },
  ],
}

export async function GET(request: NextRequest) {
  try {
    // Get overall statistics
    const [totalAgents, activeAgents, totalTransactions, activeAlerts, avgTrustScore] = await Promise.all([
      prisma.aIAgent.count(),
      prisma.aIAgent.count({ where: { status: "active" } }),
      prisma.transaction.count(),
      prisma.alert.count({ where: { resolved: false } }),
      prisma.aIAgent.aggregate({
        _avg: { trustScore: true },
      }),
    ])

    const allAgents = await prisma.aIAgent.findMany({
      select: { trustScore: true },
    })

    const trustDistribution = {
      excellent: allAgents.filter((a) => a.trustScore >= 80).length,
      good: allAgents.filter((a) => a.trustScore >= 60 && a.trustScore < 80).length,
      fair: allAgents.filter((a) => a.trustScore >= 40 && a.trustScore < 60).length,
      poor: allAgents.filter((a) => a.trustScore < 40).length,
    }

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const transactionsByDay = await prisma.transaction.groupBy({
      by: ["timestamp"],
      _count: true,
      where: {
        timestamp: { gte: sevenDaysAgo },
      },
    })

    const transactionTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000)
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      const count = transactionsByDay
        .filter((t) => {
          const txDate = new Date(t.timestamp)
          return txDate.toDateString() === date.toDateString()
        })
        .reduce((sum, t) => sum + t._count, 0)
      return { date: dateStr, count }
    })

    const alertsBySeverity = await prisma.alert.groupBy({
      by: ["severity"],
      _count: true,
      where: { resolved: false },
    })

    const alertsData = alertsBySeverity.map((a) => ({
      severity: a.severity,
      count: a._count,
    }))

    const topAgents = await prisma.aIAgent.findMany({
      select: {
        name: true,
        trustScore: true,
      },
      orderBy: { trustScore: "desc" },
      take: 5,
    })

    // Get recent activity
    const recentTransactions = await prisma.transaction.count({
      where: {
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    })

    const recentAlerts = await prisma.alert.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    })

    return NextResponse.json({
      stats: {
        totalAgents,
        activeAgents,
        totalTransactions,
        activeAlerts,
        avgTrustScore: avgTrustScore._avg.trustScore || 0,
        recentTransactions,
        recentAlerts,
      },
      trustDistribution,
      transactionTrend,
      alertsBySeverity: alertsData,
      topAgents,
    })
  } catch (error) {
    console.error("[v0] Database error, using demo data:", error)
    return NextResponse.json(DEMO_STATS)
  }
}
