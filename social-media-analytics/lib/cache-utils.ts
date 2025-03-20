// Simple in-memory cache to reduce API calls
export class Cache<T> {
  private cache: Map<string, { data: T; timestamp: number }> = new Map()
  private ttl: number // Time to live in milliseconds

  constructor(ttlInSeconds = 60) {
    this.ttl = ttlInSeconds * 1000
  }

  get(key: string): T | null {
    const item = this.cache.get(key)

    if (!item) {
      return null
    }

    // Check if the item has expired
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  clear(): void {
    this.cache.clear()
  }
}

