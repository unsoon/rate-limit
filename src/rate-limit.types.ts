import { ModuleMetadata, Type } from '@nestjs/common';
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
  includeHeaders?: boolean;
}

export type RateLimitConfig = RateLimitOptions | ((request: Request) => RateLimitOptions);

export interface RateLimitConfigFactory {
  createRateLimitConfig(): Promise<RateLimitConfig> | RateLimitConfig;
}

export interface RateLimitAsyncConfig extends Pick<ModuleMetadata, 'imports'> {
  /**
   * The `useExisting` syntax allows you to create aliases for existing providers.
   */
  useExisting?: Type<RateLimitConfigFactory>;
  /**
   * The `useClass` syntax allows you to dynamically determine a class
   * that a token should resolve to.
   */
  useClass?: Type<RateLimitConfigFactory>;
  /**
   * The `useFactory` syntax allows for creating providers dynamically.
   */
  useFactory?: (...args: any[]) => Promise<RateLimitConfig> | RateLimitConfig;
  /**
   * Optional list of providers to be injected into the context of the Factory function.
   */
  inject?: any[];
}
