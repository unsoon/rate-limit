import { RateLimitStore, RateLimitStoreValues } from '../rate-limit.types';

export class RedisStore implements RateLimitStore {
  ttl = 0;

  constructor(private readonly redis: (...data: string[]) => Promise<unknown>) {}

  async set(key: string, value: RateLimitStoreValues) {
    await this.redis('PSETEX', key, String(this.ttl), JSON.stringify(value));
    return value;
  }

  async get(key: string) {
    const data = await this.redis('GET', key);
    if (!data || typeof data !== 'string') return null;
    return JSON.parse(data) as RateLimitStoreValues;
  }

  async delete(key: string) {
    await this.redis('DEL', key);
  }
}
