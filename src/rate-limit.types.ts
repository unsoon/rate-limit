import { Request } from 'express';

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
