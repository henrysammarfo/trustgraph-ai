import { config } from "@/lib/config"
import type { BlockchainTransaction } from "@/lib/types"

export class MoralisService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = config.moralis.apiKey
    this.baseUrl = config.moralis.baseUrl
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "X-API-Key": this.apiKey,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Moralis API error: ${response.statusText}`)
    }

    return response.json()
  }

  async getWalletTransactions(address: string, chain = "eth"): Promise<BlockchainTransaction[]> {
    try {
      const data = await this.request(`/${address}?chain=${chain}`)
      return this.normalizeTransactions(data.result || [])
    } catch (error) {
      console.error("[v0] Moralis getWalletTransactions error:", error)
      throw error
    }
  }

  async getTransactionByHash(hash: string, chain = "eth"): Promise<BlockchainTransaction | null> {
    try {
      const data = await this.request(`/transaction/${hash}?chain=${chain}`)
      return this.normalizeTransaction(data)
    } catch (error) {
      console.error("[v0] Moralis getTransactionByHash error:", error)
      return null
    }
  }

  async getWalletBalance(address: string, chain = "eth") {
    try {
      const data = await this.request(`/${address}/balance?chain=${chain}`)
      return data.balance
    } catch (error) {
      console.error("[v0] Moralis getWalletBalance error:", error)
      throw error
    }
  }

  async getWalletTokenBalances(address: string, chain = "eth") {
    try {
      const data = await this.request(`/${address}/erc20?chain=${chain}`)
      return data
    } catch (error) {
      console.error("[v0] Moralis getWalletTokenBalances error:", error)
      throw error
    }
  }

  async createWebhookStream(address: string, webhookUrl: string, chains: string[]) {
    try {
      const response = await fetch("https://api.moralis-streams.com/streams/evm", {
        method: "POST",
        headers: {
          "X-API-Key": this.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          webhookUrl,
          description: `Monitor transactions for ${address}`,
          tag: `agent_${address}`,
          chains,
          includeNativeTxs: true,
          includeContractLogs: true,
          includeInternalTxs: true,
          allAddresses: false,
          demo: false,
          triggers: [
            {
              type: "tx",
              contractAddress: address,
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create webhook stream: ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error("[v0] Moralis createWebhookStream error:", error)
      throw error
    }
  }

  private normalizeTransaction(tx: any): BlockchainTransaction {
    return {
      hash: tx.hash,
      from: tx.from_address,
      to: tx.to_address,
      value: tx.value,
      gas: tx.gas,
      gasPrice: tx.gas_price,
      blockNumber: tx.block_number,
      timestamp: tx.block_timestamp ? new Date(tx.block_timestamp).getTime() / 1000 : Date.now() / 1000,
      status: tx.receipt_status === "1" ? 1 : 0,
    }
  }

  private normalizeTransactions(txs: any[]): BlockchainTransaction[] {
    return txs.map((tx) => this.normalizeTransaction(tx))
  }
}

export const moralisService = new MoralisService()
