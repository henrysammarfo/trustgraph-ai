import { neon } from "@neondatabase/serverless"

// Initialize Neon database connection
const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

export { sql }

// Database helper functions
export const db = {
  // Users
  async createUser(email: string, name?: string) {
    const id = crypto.randomUUID()
    const [user] = await sql`
      INSERT INTO users (id, email, name)
      VALUES (${id}, ${email}, ${name})
      RETURNING *
    `
    return user
  },

  async getUserByEmail(email: string) {
    const [user] = await sql`
      SELECT * FROM users WHERE email = ${email}
    `
    return user
  },

  // Agents
  async createAgent(userId: string, address: string, name: string, blockchain: string) {
    const id = crypto.randomUUID()
    const [agent] = await sql`
      INSERT INTO agents (id, user_id, address, name, blockchain)
      VALUES (${id}, ${userId}, ${address}, ${name}, ${blockchain})
      RETURNING *
    `
    return agent
  },

  async getAgentsByUserId(userId: string) {
    return await sql`
      SELECT * FROM agents 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `
  },

  async getAgentByAddress(address: string) {
    const [agent] = await sql`
      SELECT * FROM agents WHERE address = ${address}
    `
    return agent
  },

  async updateAgentTrustScore(agentId: string, score: number) {
    const [agent] = await sql`
      UPDATE agents 
      SET trust_score = ${score}, updated_at = NOW()
      WHERE id = ${agentId}
      RETURNING *
    `
    return agent
  },

  // Transactions
  async createTransaction(data: {
    agentId: string
    hash: string
    fromAddress: string
    toAddress: string
    value: string
    blockchain: string
    timestamp: Date
  }) {
    const id = crypto.randomUUID()
    const [transaction] = await sql`
      INSERT INTO transactions (id, agent_id, hash, from_address, to_address, value, blockchain, timestamp)
      VALUES (${id}, ${data.agentId}, ${data.hash}, ${data.fromAddress}, ${data.toAddress}, ${data.value}, ${data.blockchain}, ${data.timestamp})
      RETURNING *
    `
    return transaction
  },

  async getTransactionsByAgentId(agentId: string, limit = 100) {
    return await sql`
      SELECT * FROM transactions 
      WHERE agent_id = ${agentId}
      ORDER BY timestamp DESC
      LIMIT ${limit}
    `
  },

  // Alerts
  async createAlert(agentId: string, type: string, severity: string, message: string) {
    const id = crypto.randomUUID()
    const [alert] = await sql`
      INSERT INTO alerts (id, agent_id, type, severity, message)
      VALUES (${id}, ${agentId}, ${type}, ${severity}, ${message})
      RETURNING *
    `
    return alert
  },

  async getAlertsByAgentId(agentId: string, resolved?: boolean) {
    if (resolved !== undefined) {
      return await sql`
        SELECT * FROM alerts 
        WHERE agent_id = ${agentId} AND resolved = ${resolved}
        ORDER BY created_at DESC
      `
    }
    return await sql`
      SELECT * FROM alerts 
      WHERE agent_id = ${agentId}
      ORDER BY created_at DESC
    `
  },

  async resolveAlert(alertId: string) {
    const [alert] = await sql`
      UPDATE alerts 
      SET resolved = TRUE, resolved_at = NOW()
      WHERE id = ${alertId}
      RETURNING *
    `
    return alert
  },

  // Trust Scores
  async saveTrustScore(agentId: string, score: number, factors: any) {
    const id = crypto.randomUUID()
    const [trustScore] = await sql`
      INSERT INTO trust_scores (id, agent_id, score, factors)
      VALUES (${id}, ${agentId}, ${score}, ${factors})
      RETURNING *
    `
    return trustScore
  },

  async getTrustScoreHistory(agentId: string, limit = 100) {
    return await sql`
      SELECT * FROM trust_scores 
      WHERE agent_id = ${agentId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `
  },
}
