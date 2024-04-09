import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TokenRateLimiter } from '@strivee-api/security';
import { getAccountFromContext } from '@strivee-api/security/infrastructure/function';

@Injectable()
export class TokenRateLimitGuard implements CanActivate {
  constructor(private readonly limiter: TokenRateLimiter) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const account = await getAccountFromContext(context);

    if (await this.limiter.hasAvailableToken(account)) {
      return true;
    }

    throw new HttpException(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        error: 'Too Many Requests',
        message: 'No more tokens are available to make requests.',
      },
      429,
    );
  }
}
