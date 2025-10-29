// Redis client for caching and rate limiting
class RedisClient {
  private cache: Map<string, { value: any; expiry: number }> = new Map()

  async get(key: string): Promise<any> {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  async set(key: string, value: any, ttlSeconds = 300): Promise<void> {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttlSeconds * 1000,
    })
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key)
  }

  async exists(key: string): Promise<boolean> {
    const item = this.cache.get(key)
    if (!item) return false

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  async incr(key: string): Promise<number> {
    const current = (await this.get(key)) || 0
    const newValue = current + 1
    await this.set(key, newValue, 60) // 1 minute TTL for rate limiting
    return newValue
  }

  async expire(key: string, seconds: number): Promise<void> {
    const item = this.cache.get(key)
    if (item) {
      item.expiry = Date.now() + seconds * 1000
    }
  }
}

export const redis = new RedisClient()
