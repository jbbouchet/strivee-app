import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TokenRateLimiter } from '@strivee-api/security';
import { getAccountFromContext } from '@strivee-api/security/infrastructure/function';

@Injectable()
export class TokenRateLimitGuard implements CanActivate {
  constructor(private readonly limiter: TokenRateLimiter) {}

  /**
   * Determines whether the account associated with the execution context has available tokens to execute the request.
   *
   * @param context - Current execution context.Provides access to details about the current request pipeline.
   * @returns {Promise<boolean>} - Value indicating whether the current request is allowed to
   * proceed.
   * @throws {HttpException} - Throws an 429 Http exception if the account no longer has any tokens available.
   */
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
