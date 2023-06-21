import { RateLimitStore, RateLimitStoreValues } from '../rate-limit.types';

export class MemoryStore implements RateLimitStore {
  ttl = 0;

  private readonly store = new Map<string, RateLimitStoreValues>();

  async set(key: string, value: RateLimitStoreValues) {
    const current = await this.store.get(key);
    if (current) clearTimeout(current.timeoutId);

    await this.store.set(key, {
      ...value,
      timeoutId: setTimeout(() => this.delete(key), this.ttl),
    });

    return value;
  }

  async get(key: string) {
    return this.store.get(key) ?? null;
  }

  async delete(key: string) {
    await this.store.delete(key);
  }
}
