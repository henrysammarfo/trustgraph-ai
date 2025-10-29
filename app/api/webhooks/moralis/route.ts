import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature
    const signature = request.headers.get("x-signature")
    const body = await request.text()

    if (signature) {
      const expectedSignature = crypto
        .createHmac("sha256", process.env.MORALIS_API_KEY || "")
        .update(body)
        .digest("hex")

      if (signature !== expectedSignature) {
        console.error("[v0] Invalid webhook signature")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    }

    const data = JSON.parse(body)
    console.log("[v0] Received Moralis webhook:", data)

    // Process transactions from webhook
    if (data.txs && Array.isArray(data.txs)) {
      for (const tx of data.txs) {
        await processWebhookTransaction(tx, data.chainId)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function processWebhookTransaction(tx: any, chainId: string) {
  try {
    // Find agent by address (either from or to)
    const agent = await prisma.aIAgent.findFirst({
      where: {
        OR: [{ address: tx.fromAddress }, { address: tx.toAddress }],
      },
    })

    if (!agent) {
      console.log(`[v0] No agent found for transaction: ${tx.hash}`)
      return
    }

    // Check if transaction already exists
    const existing = await prisma.transaction.findUnique({
      where: { hash: tx.hash },
    })

    if (existing) {
      return
    }

    // Store transaction
    await prisma.transaction.create({
      data: {
        hash: tx.hash,
        agentId: agent.id,
        from: tx.fromAddress,
        to: tx.toAddress,
        value: tx.value,
        gasUsed: tx.gas,
        gasPrice: tx.gasPrice,
        status: tx.receiptStatus === "1" ? "success" : "failed",
        chainId: Number.parseInt(chainId),
        blockNumber: tx.blockNumber,
        timestamp: new Date(tx.blockTimestamp),
        analyzed: false,
      },
    })

    console.log(`[v0] Stored webhook transaction: ${tx.hash}`)
  } catch (error) {
    console.error(`[v0] Error processing webhook transaction:`, error)
  }
}
