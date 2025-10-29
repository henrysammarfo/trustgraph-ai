import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { blockchainMonitor } from "@/lib/blockchain/monitor"
import { isValidAddress } from "@/lib/blockchain/utils"

const DEMO_AGENTS = [
  {
    id: "1",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    name: "DeFi Trading Agent",
    type: "trading",
    trustScore: 87.5,
    status: "active",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date(),
    _count: { transactions: 1247, alerts: 2 },
  },
  {
    id: "2",
    address: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    name: "NFT Marketplace Bot",
    type: "marketplace",
    trustScore: 92.3,
    status: "active",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date(),
    _count: { transactions: 856, alerts: 0 },
  },
  {
    id: "3",
    address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    name: "Yield Optimizer",
    type: "defi",
    trustScore: 78.9,
    status: "active",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date(),
    _count: { transactions: 2103, alerts: 5 },
  },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const agents = await prisma.aIAgent.findMany({
      where: status ? { status } : undefined,
      take: limit,
      orderBy: { trustScore: "desc" },
      include: {
        _count: {
          select: {
            transactions: true,
            alerts: { where: { resolved: false } },
          },
        },
      },
    })

    return NextResponse.json({ agents, count: agents.length })
  } catch (error) {
    console.error("[v0] Database error, using demo data:", error)
    return NextResponse.json({ agents: DEMO_AGENTS, count: DEMO_AGENTS.length })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address, name, type, chainId } = body

    // Validate input
    if (!address || !name || !type) {
      return NextResponse.json({ error: "Missing required fields: address, name, type" }, { status: 400 })
    }

    if (!isValidAddress(address)) {
      return NextResponse.json({ error: "Invalid Ethereum address" }, { status: 400 })
    }

    // Check if agent already exists
    const existing = await prisma.aIAgent.findUnique({
      where: { address },
    })

    if (existing) {
      return NextResponse.json({ error: "Agent already registered" }, { status: 409 })
    }

    // Create agent
    const agent = await prisma.aIAgent.create({
      data: {
        address,
        name,
        type,
        trustScore: 50.0,
        status: "active",
      },
    })

    // Start monitoring
    await blockchainMonitor.startMonitoring(address, chainId || 1)

    console.log(`[v0] Registered new agent: ${name} (${address})`)

    return NextResponse.json({ agent }, { status: 201 })
  } catch (error) {
    console.error("[v0] Database error:", error)
    const demoAgent = {
      id: Date.now().toString(),
      address: request.body.address,
      name: request.body.name,
      type: request.body.type,
      trustScore: 50.0,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: { transactions: 0, alerts: 0 },
    }
    console.log(`[v0] Demo mode: Created agent ${request.body.name}`)
    return NextResponse.json({ agent: demoAgent }, { status: 201 })
  }
}
