import { Request } from 'express';

export abstract class RateLimitStore {
  ttl = 0;
  abstract get(key: string): Promise<RateLimitStoreValues | null>;
  abstract set(key: string, value: RateLimitStoreValues): Promise<RateLimitStoreValues>;
  abstract delete(key: string): Promise<void>;
}

export interface RateLimitStoreValues extends Record<string, any> {
  /**
   * The number of requests made.
   */
  count: number;
  /**
   * The number of requests remaining in the current rate limit window.
   */
  remaining: number;
}

export interface RateLimitOptions {
  limit: number;
  window: number;
  timeout?: number;
  fingerprint?: string | ((request: Request) => string);
  ignoreUserAgents?: RegExp[];
  skipIf?: boolean | ((request: Request) => boolean);
  errorMessage?: string;
  store: RateLimitStore;
}

export type RateLimitConfig = RateLimitOptions | ((request: Request) => RateLimitOptions);
