import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  try {
    const { address } = await params
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    // Find agent
    const agent = await prisma.aIAgent.findUnique({
      where: { address },
    })

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    // Fetch trust scores
    const trustScores = await prisma.trustScore.findMany({
      where: { agentId: agent.id },
      take: limit,
      orderBy: { timestamp: "desc" },
    })

    return NextResponse.json({ trustScores, count: trustScores.length })
  } catch (error) {
    console.error("[v0] Error fetching trust scores:", error)
    return NextResponse.json({ error: "Failed to fetch trust scores" }, { status: 500 })
  }
}
