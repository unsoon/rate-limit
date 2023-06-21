import { Request } from 'express';

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
}

export type RateLimitConfig = RateLimitOptions | ((request: Request) => RateLimitOptions);
