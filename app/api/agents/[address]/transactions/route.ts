import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  try {
    const { address } = await params
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const status = searchParams.get("status")
    const chainId = searchParams.get("chainId")

    // Find agent
    const agent = await prisma.aIAgent.findUnique({
      where: { address },
    })

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    // Fetch transactions
    const transactions = await prisma.transaction.findMany({
      where: {
        agentId: agent.id,
        ...(status && { status }),
        ...(chainId && { chainId: Number.parseInt(chainId) }),
      },
      take: limit,
      orderBy: { timestamp: "desc" },
    })

    return NextResponse.json({ transactions, count: transactions.length })
  } catch (error) {
    console.error("[v0] Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}
