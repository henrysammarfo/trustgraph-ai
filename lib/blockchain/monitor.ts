import { prisma } from "@/lib/prisma"
import { moralisService } from "./moralis"
import type { BlockchainTransaction } from "@/lib/types"

export class BlockchainMonitor {
  private monitoringIntervals: Map<string, NodeJS.Timeout> = new Map()

  async startMonitoring(agentAddress: string, chainId = 1) {
    console.log(`[v0] Starting monitoring for agent: ${agentAddress} on chain: ${chainId}`)

    // Check if already monitoring
    if (this.monitoringIntervals.has(agentAddress)) {
      console.log(`[v0] Already monitoring agent: ${agentAddress}`)
      return
    }

    // Initial fetch
    await this.fetchAndStoreTransactions(agentAddress, chainId)

    // Set up periodic monitoring (every 30 seconds)
    const interval = setInterval(async () => {
      await this.fetchAndStoreTransactions(agentAddress, chainId)
    }, 30000)

    this.monitoringIntervals.set(agentAddress, interval)
  }

  async stopMonitoring(agentAddress: string) {
    const interval = this.monitoringIntervals.get(agentAddress)
    if (interval) {
      clearInterval(interval)
      this.monitoringIntervals.delete(agentAddress)
      console.log(`[v0] Stopped monitoring agent: ${agentAddress}`)
    }
  }

  private async fetchAndStoreTransactions(agentAddress: string, chainId: number) {
    try {
      // Get agent from database
      const agent = await prisma.aIAgent.findUnique({
        where: { address: agentAddress },
      })

      if (!agent) {
        console.error(`[v0] Agent not found: ${agentAddress}`)
        return
      }

      // Fetch transactions from Moralis
      const chain = this.getChainName(chainId)
      const transactions = await moralisService.getWalletTransactions(agentAddress, chain)

      console.log(`[v0] Fetched ${transactions.length} transactions for ${agentAddress}`)

      // Store new transactions
      for (const tx of transactions) {
        await this.storeTransaction(tx, agent.id, chainId)
      }
    } catch (error) {
      console.error(`[v0] Error fetching transactions for ${agentAddress}:`, error)
    }
  }

  private async storeTransaction(tx: BlockchainTransaction, agentId: string, chainId: number) {
    try {
      // Check if transaction already exists
      const existing = await prisma.transaction.findUnique({
        where: { hash: tx.hash },
      })

      if (existing) {
        return // Transaction already stored
      }

      // Store new transaction
      await prisma.transaction.create({
        data: {
          hash: tx.hash,
          agentId,
          from: tx.from,
          to: tx.to,
          value: tx.value,
          gasUsed: tx.gas,
          gasPrice: tx.gasPrice,
          status: tx.status === 1 ? "success" : "failed",
          chainId,
          blockNumber: tx.blockNumber,
          timestamp: new Date(tx.timestamp * 1000),
          analyzed: false,
        },
      })

      console.log(`[v0] Stored transaction: ${tx.hash}`)
    } catch (error) {
      console.error(`[v0] Error storing transaction ${tx.hash}:`, error)
    }
  }

  private getChainName(chainId: number): string {
    const chainMap: Record<number, string> = {
      1: "eth",
      137: "polygon",
      42161: "arbitrum",
      56: "bsc",
    }
    return chainMap[chainId] || "eth"
  }

  async getUnanalyzedTransactions(limit = 50) {
    return prisma.transaction.findMany({
      where: { analyzed: false },
      take: limit,
      orderBy: { timestamp: "desc" },
      include: {
        agent: true,
      },
    })
  }

  async markTransactionAnalyzed(transactionId: string) {
    return prisma.transaction.update({
      where: { id: transactionId },
      data: { analyzed: true },
    })
  }
}

export const blockchainMonitor = new BlockchainMonitor()
