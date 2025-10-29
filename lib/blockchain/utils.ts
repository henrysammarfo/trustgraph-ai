export function formatWeiToEth(wei: string): string {
  try {
    const weiNum = BigInt(wei)
    const eth = Number(weiNum) / 1e18
    return eth.toFixed(6)
  } catch {
    return "0"
  }
}

export function formatGwei(wei: string): string {
  try {
    const weiNum = BigInt(wei)
    const gwei = Number(weiNum) / 1e9
    return gwei.toFixed(2)
  } catch {
    return "0"
  }
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return ""
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function getChainName(chainId: number): string {
  const chains: Record<number, string> = {
    1: "Ethereum",
    137: "Polygon",
    42161: "Arbitrum",
    56: "BSC",
  }
  return chains[chainId] || "Unknown"
}

export function getChainExplorerUrl(chainId: number, hash: string): string {
  const explorers: Record<number, string> = {
    1: "https://etherscan.io/tx/",
    137: "https://polygonscan.com/tx/",
    42161: "https://arbiscan.io/tx/",
    56: "https://bscscan.com/tx/",
  }
  const baseUrl = explorers[chainId] || "https://etherscan.io/tx/"
  return `${baseUrl}${hash}`
}

export function calculateGasCost(gasUsed: string, gasPrice: string): string {
  try {
    const cost = BigInt(gasUsed) * BigInt(gasPrice)
    return formatWeiToEth(cost.toString())
  } catch {
    return "0"
  }
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function isValidTransactionHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash)
}
