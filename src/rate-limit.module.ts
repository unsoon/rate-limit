import { DynamicModule, Global, Module } from '@nestjs/common';
import { RATE_LIMIT_CONFIG } from './rate-limit.constants';
import { RateLimitConfig } from './rate-limit.types';

@Global()
@Module({})
export class RateLimitModule {
  static forRoot(config: RateLimitConfig): DynamicModule {
    return {
      module: RateLimitModule,
      providers: [
        {
          provide: RATE_LIMIT_CONFIG,
          useValue: config,
        },
      ],
      exports: [RATE_LIMIT_CONFIG],
    };
  }
}
