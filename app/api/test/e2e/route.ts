import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { blockchainMonitor } from "@/lib/blockchain/monitor"
import { trustAnalyzer } from "@/lib/ai/analyzer"

export async function POST() {
  const results = {
    steps: [] as any[],
    success: false,
  }

  try {
    results.steps.push({ step: 1, name: "Create test agent", status: "running" })
    const agent = await prisma.aIAgent.create({
      data: {
        address: "0xTEST" + Date.now(),
        name: "Test Agent",
        type: "trading",
        trustScore: 0,
        status: "active",
      },
    })
    results.steps[0].status = "success"
    results.steps[0].data = { agentId: agent.id }

    results.steps.push({ step: 2, name: "Start blockchain monitoring", status: "running" })
    await blockchainMonitor.startMonitoring(agent.address, 1)
    results.steps[1].status = "success"

    results.steps.push({ step: 3, name: "Create test transaction", status: "running" })
    const transaction = await prisma.transaction.create({
      data: {
        hash: "0xTEST" + Date.now(),
        agentId: agent.id,
        from: agent.address,
        to: "0xRecipient",
        value: "1000000000000000000",
        gasUsed: "21000",
        status: "success",
        chainId: 1,
        blockNumber: 12345678,
        timestamp: new Date(),
      },
    })
    results.steps[2].status = "success"
    results.steps[2].data = { transactionId: transaction.id }

    results.steps.push({ step: 4, name: "Run AI trust analysis", status: "running" })
    const analysis = await trustAnalyzer.analyzeAgent(agent.id)
    results.steps[3].status = "success"
    results.steps[3].data = { trustScore: analysis.trustScore }

    results.steps.push({ step: 5, name: "Verify trust score saved", status: "running" })
    const updatedAgent = await prisma.aIAgent.findUnique({
      where: { id: agent.id },
      include: { trustScores: true },
    })
    results.steps[4].status = "success"
    results.steps[4].data = {
      trustScore: updatedAgent?.trustScore,
      scoreCount: updatedAgent?.trustScores.length,
    }

    results.steps.push({ step: 6, name: "Cleanup test data", status: "running" })
    await blockchainMonitor.stopMonitoring(agent.address)
    await prisma.transaction.deleteMany({ where: { agentId: agent.id } })
    await prisma.trustScore.deleteMany({ where: { agentId: agent.id } })
    await prisma.aIAgent.delete({ where: { id: agent.id } })
    results.steps[5].status = "success"

    results.success = true
    return NextResponse.json(results)
  } catch (error: any) {
    return NextResponse.json(
      {
        ...results,
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
