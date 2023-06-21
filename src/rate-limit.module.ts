import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';
import { RATE_LIMIT_CONFIG } from './rate-limit.constants';
import { RateLimitAsyncConfig, RateLimitConfig, RateLimitConfigFactory } from './rate-limit.types';

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

  static forRootAsync(config: RateLimitAsyncConfig): DynamicModule {
    return {
      module: RateLimitModule,
      providers: this.createAsyncProviders(config),
      exports: [RATE_LIMIT_CONFIG],
      imports: config.imports || [],
    };
  }

  private static createAsyncProviders(config: RateLimitAsyncConfig): Provider[] {
    if (config.useExisting || config.useFactory) return [this.createAsyncConfigProvider(config)];

    const useClass = config.useClass as Type<RateLimitConfigFactory>;

    return [
      this.createAsyncConfigProvider(config),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncConfigProvider(config: RateLimitAsyncConfig): Provider {
    if (config.useFactory) {
      return {
        provide: RATE_LIMIT_CONFIG,
        useFactory: config.useFactory,
        inject: config.inject || [],
      };
    }

    const inject = [(config.useExisting || config.useClass) as Type<RateLimitConfigFactory>];

    return {
      provide: RATE_LIMIT_CONFIG,
      useFactory: async (configFactory: RateLimitConfigFactory) =>
        await configFactory.createRateLimitConfig(),
      inject,
    };
  }
}
