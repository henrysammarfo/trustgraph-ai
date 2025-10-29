import { redis } from "./client"

export class RateLimiter {
  async checkRateLimit(
    identifier: string,
    maxRequests = 100,
    windowSeconds = 60,
  ): Promise<{
    allowed: boolean
    remaining: number
    resetAt: Date
  }> {
    const key = `ratelimit:${identifier}`
    const count = await redis.incr(key)

    if (count === 1) {
      await redis.expire(key, windowSeconds)
    }

    const allowed = count <= maxRequests
    const remaining = Math.max(0, maxRequests - count)
    const resetAt = new Date(Date.now() + windowSeconds * 1000)

    return {
      allowed,
      remaining,
      resetAt,
    }
  }

  async checkIPRateLimit(ip: string): Promise<boolean> {
    const result = await this.checkRateLimit(`ip:${ip}`, 100, 60)
    return result.allowed
  }

  async checkAPIKeyRateLimit(apiKey: string): Promise<boolean> {
    const result = await this.checkRateLimit(`apikey:${apiKey}`, 1000, 60)
    return result.allowed
  }
}

export const rateLimiter = new RateLimiter()
