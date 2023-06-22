import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { createHash } from 'crypto';
import { Request, Response } from 'express';
import { RATE_LIMIT_CONFIG, RATE_LIMIT_SKIP } from './rate-limit.constants';
import { RateLimitException } from './rate-limit.exception';
import { RateLimitService } from './rate-limit.service';
import { RateLimitConfig, RateLimitOptions } from './rate-limit.types';

@Injectable()
export class RateLimitGuard implements CanActivate {
  protected options?: RateLimitOptions;

  constructor(
    @Inject(RATE_LIMIT_CONFIG)
    private readonly rateLimitConfig: RateLimitConfig,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    if (this.checkConditions(context)) return true;

    const { response } = this.getRequestResponse(context);
    const options = this.getRateLimitOptions(context);
    const fingerprint = this.getHashedFingerprint(context);

    const { limit, remaining, reset, success } = await new RateLimitService({
      limit: options.limit,
      window: options.window,
      timeout: options.timeout,
      store: options.store,
    }).check(fingerprint);

    if (typeof response.header === 'function' && options.includeHeaders) {
      if (success) {
        response.header('x-rate-limit', String(limit));
        response.header('x-rate-remaining', String(remaining));
        response.header('x-rate-reset', String(reset));
      } else {
        response.header('retry-after', String(reset));
      }
    }

    if (!success) throw new RateLimitException(options.errorMessage);
    return success;
  }

  private getRefs(context: ExecutionContext) {
    return [context.getHandler(), context.getClass()];
  }

  private checkConditions(context: ExecutionContext) {
    const { request } = this.getRequestResponse(context);
    const refs = this.getRefs(context);
    const skip = this.reflector.getAllAndOverride<boolean>(RATE_LIMIT_SKIP, refs);

    const options = this.getRateLimitOptions(context);

    const skipIf =
      options.skipIf && typeof options.skipIf === 'function'
        ? options.skipIf(request)
        : options.skipIf;

    if (skipIf || skip) return true;

    if (Array.isArray(options.ignoreUserAgents)) {
      const userAgent = request.headers['user-agent'] ?? String();

      for (const pattern of options.ignoreUserAgents) {
        if (pattern.test(userAgent)) return true;
      }
    }
  }

  private getRateLimitOptions(context: ExecutionContext) {
    const { request } = this.getRequestResponse(context);

    const rateLimitConfigFromReflector = this.reflector.getAllAndOverride<Partial<RateLimitConfig>>(
      RATE_LIMIT_CONFIG,
      this.getRefs(context),
    );

    const rateLimitOptions =
      typeof this.rateLimitConfig === 'function'
        ? this.rateLimitConfig(request)
        : this.rateLimitConfig;

    const rateLimitOptionsFromReflector =
      typeof rateLimitConfigFromReflector === 'function'
        ? rateLimitConfigFromReflector(request)
        : rateLimitConfigFromReflector;

    const options = <RateLimitOptions>{
      ...rateLimitOptions,
      ...rateLimitOptionsFromReflector,
    };

    options.includeHeaders ??= true;

    this.options = options;

    return options;
  }

  private getHashedFingerprint(context: ExecutionContext) {
    const fingerprint = this.getFingerprint(context);
    return createHash('md5').update(fingerprint).digest('hex');
  }

  protected getFingerprint(context: ExecutionContext) {
    const { request } = this.getRequestResponse(context);
    const options = this.getRateLimitOptions(context);

    return (
      (options.fingerprint &&
        (typeof options.fingerprint === 'function'
          ? options.fingerprint(request)
          : options.fingerprint)) ??
      request.ip
    );
  }

  protected getRequestResponse(context: ExecutionContext): {
    request: Request;
    response: Response;
  } {
    const http = context.switchToHttp();

    return {
      request: http.getRequest<Request>(),
      response: http.getResponse<Response>(),
    };
  }
}
