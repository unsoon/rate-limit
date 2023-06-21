import { RateLimitOptions, RateLimitStore } from './rate-limit.types';

export interface CheckResponse {
  /**
   * The maximum number of requests allowed within the window.
   */
  limit: number;
  /**
   * The number of requests allowed within the window.
   */
  remaining: number;
  /**
   * The number of seconds until the window resets.
   */
  reset: number;
  /**
   * Whether the request was allowed.
   */
  success: boolean;
}

export class RateLimitService {
  private readonly store: RateLimitStore;
  private readonly window: number;
  private readonly limit: number;
  private readonly timeout: number;

  constructor(options: Pick<RateLimitOptions, 'store' | 'window' | 'limit' | 'timeout'>) {
    this.store = options.store;
    this.window = options.window;
    this.limit = options.limit;
    this.timeout = options.timeout ?? options.window;
  }

  private async updateTimeout(fingerprint: string, count: number, ms: number) {
    this.store.ttl = ms;

    return this.store.set(fingerprint, {
      count,
      remaining: Date.now() + ms,
    });
  }

  async check(fingerprint: string): Promise<CheckResponse> {
    let value = await this.store.get(fingerprint);
    let success = true;

    value ??= await this.updateTimeout(fingerprint, 0, this.window);

    if (value.count < this.limit) {
      value = await this.updateTimeout(fingerprint, ++value.count, this.window);
    } else if (value.count === this.limit) {
      value = await this.updateTimeout(fingerprint, ++value.count, this.timeout);
      success = false;
    } else {
      success = false;
    }

    return {
      limit: this.limit,
      remaining: Math.max(this.limit - value.count),
      reset: Math.floor((value.remaining - Date.now()) / 1000),
      success,
    };
  }
}
