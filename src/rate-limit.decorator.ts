import { SetMetadata } from '@nestjs/common';
import { RATE_LIMIT_SKIP } from './rate-limit.constants';

export const SkipRateLimit = (skip = true) => SetMetadata(RATE_LIMIT_SKIP, skip);
