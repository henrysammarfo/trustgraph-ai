import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const DEMO_ALERTS = [
  {
    id: "1",
    type: "anomaly",
    severity: "high",
    message: "Unusual transaction pattern detected: 15 transactions in 2 minutes",
    resolved: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    agentId: "1",
    agent: {
      id: "1",
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      name: "DeFi Trading Agent",
      trustScore: 87.5,
    },
  },
  {
    id: "2",
    type: "risk",
    severity: "medium",
    message: "Trust score dropped by 5 points in the last hour",
    resolved: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    agentId: "3",
    agent: {
      id: "3",
      address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
      name: "Yield Optimizer",
      trustScore: 78.9,
    },
  },
  {
    id: "3",
    type: "security",
    severity: "medium",
    message: "High gas usage detected on recent transactions",
    resolved: false,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    agentId: "1",
    agent: {
      id: "1",
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      name: "DeFi Trading Agent",
      trustScore: 87.5,
    },
  },
  {
    id: "4",
    type: "anomaly",
    severity: "low",
    message: "New transaction pattern observed",
    resolved: false,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    agentId: "2",
    agent: {
      id: "2",
      address: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      name: "NFT Marketplace Bot",
      trustScore: 92.3,
    },
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const resolved = searchParams.get("resolved")
  const severity = searchParams.get("severity")
  const type = searchParams.get("type")
  const limit = Number.parseInt(searchParams.get("limit") || "50")

  try {
    const alerts = await prisma.alert.findMany({
      where: {
        ...(resolved !== null && { resolved: resolved === "true" }),
        ...(severity && { severity }),
        ...(type && { type }),
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        agent: {
          select: {
            id: true,
            address: true,
            name: true,
            trustScore: true,
          },
        },
      },
    })

    return NextResponse.json({ alerts, count: alerts.length })
  } catch (error) {
    console.error("[v0] Database error, using demo data:", error)
    let filteredAlerts = DEMO_ALERTS

    if (resolved !== null) {
      filteredAlerts = filteredAlerts.filter((a) => a.resolved === (resolved === "true"))
    }
    if (severity) {
      filteredAlerts = filteredAlerts.filter((a) => a.severity === severity)
    }
    if (type) {
      filteredAlerts = filteredAlerts.filter((a) => a.type === type)
    }

    return NextResponse.json({ alerts: filteredAlerts.slice(0, limit), count: filteredAlerts.length })
  }
}
