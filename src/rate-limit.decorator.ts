import { SetMetadata } from '@nestjs/common';
import { RATE_LIMIT_CONFIG, RATE_LIMIT_SKIP } from './rate-limit.constants';
import { RateLimitConfig } from './rate-limit.types';

export const RateLimit = (config: Partial<RateLimitConfig> = {}) =>
  SetMetadata(RATE_LIMIT_CONFIG, config);

export const SkipRateLimit = (skip = true) => SetMetadata(RATE_LIMIT_SKIP, skip);
