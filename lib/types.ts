export interface AIAgentData {
  id: string
  address: string
  name: string
  type: string
  trustScore: number
  status: "active" | "suspended" | "flagged"
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface TransactionData {
  id: string
  hash: string
  agentId: string
  from: string
  to: string
  value: string
  gasUsed?: string
  gasPrice?: string
  status: "success" | "failed" | "pending"
  chainId: number
  blockNumber?: number
  timestamp: Date
  metadata?: Record<string, any>
  analyzed: boolean
}

export interface TrustScoreData {
  id: string
  agentId: string
  score: number
  factors: TrustScoreFactors
  analysis: string
  confidence: number
  timestamp: Date
}

export interface TrustScoreFactors {
  transactionVolume: number
  transactionFrequency: number
  gasEfficiency: number
  successRate: number
  behavioralConsistency: number
  riskLevel: number
}

export interface AlertData {
  id: string
  agentId: string
  type: "anomaly" | "risk" | "suspicious" | "critical"
  severity: "low" | "medium" | "high" | "critical"
  message: string
  details?: Record<string, any>
  resolved: boolean
  resolvedAt?: Date
  createdAt: Date
}

export interface BlockchainTransaction {
  hash: string
  from: string
  to: string
  value: string
  gas: string
  gasPrice: string
  blockNumber: number
  timestamp: number
  status: number
}

export interface WebSocketMessage {
  type: "trust_score_update" | "new_transaction" | "alert" | "agent_status"
  data: any
  timestamp: Date
}
