import { type NextRequest, NextResponse } from "next/server"
import { aiTrustAnalyzer } from "@/lib/ai/analyzer"
import { prisma } from "@/lib/prisma"
import { wsEventEmitter } from "@/lib/websocket/events"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentAddress } = body

    if (!agentAddress) {
      return NextResponse.json({ error: "Missing agentAddress" }, { status: 400 })
    }

    // Find agent
    const agent = await prisma.aIAgent.findUnique({
      where: { address: agentAddress },
    })

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    // Trigger analysis
    console.log(`[v0] Manual analysis triggered for agent: ${agent.name}`)
    const result = await aiTrustAnalyzer.analyzeAgent(agent.id)

    // Emit WebSocket event
    await wsEventEmitter.emitTrustScoreUpdate(agent.id)

    return NextResponse.json({
      message: "Analysis complete",
      result,
    })
  } catch (error) {
    console.error("[v0] Error analyzing agent:", error)
    return NextResponse.json({ error: "Failed to analyze agent" }, { status: 500 })
  }
}
