import { config } from "@/lib/config"
import type { BlockchainTransaction } from "@/lib/types"

export class AlchemyService {
  private apiKey: string
  private networks: Record<string, string>

  constructor() {
    this.apiKey = config.alchemy.apiKey
    this.networks = config.alchemy.networks
  }

  private async request(network: string, method: string, params: any[] = []) {
    const url = this.networks[network]
    if (!url) {
      throw new Error(`Unsupported network: ${network}`)
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method,
        params,
      }),
    })

    if (!response.ok) {
      throw new Error(`Alchemy API error: ${response.statusText}`)
    }

    const data = await response.json()
    if (data.error) {
      throw new Error(`Alchemy RPC error: ${data.error.message}`)
    }

    return data.result
  }

  async getTransactionByHash(hash: string, network = "ethereum"): Promise<BlockchainTransaction | null> {
    try {
      const tx = await this.request(network, "eth_getTransactionByHash", [hash])
      if (!tx) return null

      const receipt = await this.request(network, "eth_getTransactionReceipt", [hash])

      return this.normalizeTransaction(tx, receipt)
    } catch (error) {
      console.error("[v0] Alchemy getTransactionByHash error:", error)
      return null
    }
  }

  async getBlockNumber(network = "ethereum"): Promise<number> {
    try {
      const blockNumber = await this.request(network, "eth_blockNumber", [])
      return Number.parseInt(blockNumber, 16)
    } catch (error) {
      console.error("[v0] Alchemy getBlockNumber error:", error)
      throw error
    }
  }

  async getBalance(address: string, network = "ethereum"): Promise<string> {
    try {
      const balance = await this.request(network, "eth_getBalance", [address, "latest"])
      return balance
    } catch (error) {
      console.error("[v0] Alchemy getBalance error:", error)
      throw error
    }
  }

  async getTransactionCount(address: string, network = "ethereum"): Promise<number> {
    try {
      const count = await this.request(network, "eth_getTransactionCount", [address, "latest"])
      return Number.parseInt(count, 16)
    } catch (error) {
      console.error("[v0] Alchemy getTransactionCount error:", error)
      throw error
    }
  }

  async getGasPrice(network = "ethereum"): Promise<string> {
    try {
      const gasPrice = await this.request(network, "eth_gasPrice", [])
      return gasPrice
    } catch (error) {
      console.error("[v0] Alchemy getGasPrice error:", error)
      throw error
    }
  }

  private normalizeTransaction(tx: any, receipt: any): BlockchainTransaction {
    return {
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value,
      gas: tx.gas,
      gasPrice: tx.gasPrice,
      blockNumber: Number.parseInt(tx.blockNumber, 16),
      timestamp: Date.now() / 1000, // Alchemy doesn't provide timestamp directly
      status: receipt ? Number.parseInt(receipt.status, 16) : 0,
    }
  }
}

export const alchemyService = new AlchemyService()
