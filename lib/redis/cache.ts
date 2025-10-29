import { redis } from "./client"

export class CacheManager {
  async getAgentCache(agentAddress: string): Promise<any> {
    const key = `agent:${agentAddress}`
    return redis.get(key)
  }

  async setAgentCache(agentAddress: string, data: any, ttl = 300): Promise<void> {
    const key = `agent:${agentAddress}`
    await redis.set(key, data, ttl)
  }

  async invalidateAgentCache(agentAddress: string): Promise<void> {
    const key = `agent:${agentAddress}`
    await redis.del(key)
  }

  async getStatsCache(): Promise<any> {
    return redis.get("stats:global")
  }

  async setStatsCache(data: any, ttl = 60): Promise<void> {
    await redis.set("stats:global", data, ttl)
  }

  async getTrustScoreCache(agentId: string): Promise<any> {
    const key = `trustscore:${agentId}`
    return redis.get(key)
  }

  async setTrustScoreCache(agentId: string, data: any, ttl = 300): Promise<void> {
    const key = `trustscore:${agentId}`
    await redis.set(key, data, ttl)
  }
}

export const cacheManager = new CacheManager()
