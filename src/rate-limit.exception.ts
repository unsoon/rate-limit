import { HttpException, HttpStatus } from '@nestjs/common';
import { RATE_LIMIT_ERROR_MESSAGE } from './rate-limit.constants';

export class RateLimitException extends HttpException {
  constructor(message?: string) {
    super(message ?? RATE_LIMIT_ERROR_MESSAGE, HttpStatus.TOO_MANY_REQUESTS);
  }
}
