import { type NextRequest, NextResponse } from "next/server"
import { blockchainMonitor } from "@/lib/blockchain/monitor"
import { analysisScheduler } from "@/lib/ai/scheduler"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentAddress, chainId } = body

    if (!agentAddress) {
      return NextResponse.json({ error: "Missing agentAddress" }, { status: 400 })
    }

    // Start blockchain monitoring
    await blockchainMonitor.startMonitoring(agentAddress, chainId || 1)

    // Start analysis scheduler if not already running
    analysisScheduler.start()

    return NextResponse.json({
      message: "Monitoring started",
      agentAddress,
      chainId: chainId || 1,
    })
  } catch (error) {
    console.error("[v0] Error starting monitoring:", error)
    return NextResponse.json({ error: "Failed to start monitoring" }, { status: 500 })
  }
}
