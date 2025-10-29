import { type NextRequest, NextResponse } from "next/server"
import { blockchainMonitor } from "@/lib/blockchain/monitor"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentAddress } = body

    if (!agentAddress) {
      return NextResponse.json({ error: "Missing agentAddress" }, { status: 400 })
    }

    // Stop blockchain monitoring
    await blockchainMonitor.stopMonitoring(agentAddress)

    return NextResponse.json({
      message: "Monitoring stopped",
      agentAddress,
    })
  } catch (error) {
    console.error("[v0] Error stopping monitoring:", error)
    return NextResponse.json({ error: "Failed to stop monitoring" }, { status: 500 })
  }
}
