import { createClient } from 'redis';

interface GetOrSetCacheProps {
  key: string,
  callback: Function,
  expirationTime?: number
}

interface SetCacheProps {
  key: string,
  expirationTime?: number
  data: Object
}


class Cache {
  constructor(
    private readonly client = createClient(),
    private readonly oneHour = 60 * 60
  ) {
    this.client.on('error', (error) => console.error('Redis error:', error))
    this.client.connect()
  }

  async getOrSetCache({ key, expirationTime = this.oneHour, callback }: GetOrSetCacheProps) {
    const cached_value = await this.client.get(key)
    if (cached_value) return JSON.parse(cached_value)
    const data = await callback()
    if (!data) return;
    await this.client.setEx(key, expirationTime, JSON.stringify(data))

    return data
  }

  setCache({ key, expirationTime = this.oneHour, data }: SetCacheProps) {
    this.client.setEx(key, expirationTime, JSON.stringify(data))
  }

  deleteCache(key: string) {
    this.client.del(key)
  }
}

export const cache = new Cache()