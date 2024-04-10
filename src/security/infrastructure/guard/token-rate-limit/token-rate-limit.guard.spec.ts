import { ExecutionContext, HttpException } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Account, TokenRateLimiter } from '@strivee-api/security';
import { TokenRateLimitGuard } from './token-rate-limit.guard';

describe('TokenRateLimitGuard', () => {
  let guard: TokenRateLimitGuard;
  let limiter: Pick<TokenRateLimiter, 'hasAvailableToken'>;

  const createFakeContext = (account?: Account): ExecutionContext => {
    const args: Pick<HttpArgumentsHost, 'getRequest'> = {
      getRequest: jest.fn().mockReturnValue({ user: account }),
    };

    const ctx: Pick<ExecutionContext, 'switchToHttp'> = {
      switchToHttp: jest.fn().mockReturnValue(args),
    };

    return ctx as ExecutionContext;
  };

  beforeEach(() => {
    limiter = {
      hasAvailableToken: jest.fn().mockResolvedValue(false),
    };

    guard = new TokenRateLimitGuard(limiter as TokenRateLimiter);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('=> canActivate() method', () => {
    it('should test return if the limit is not reached.', async () => {
      limiter.hasAvailableToken = jest.fn().mockResolvedValue(true);

      const account: Account = { provider: 'test', ref: () => 'test' };

      const result = await guard.canActivate(createFakeContext(account));

      expect(result).toBe(true);
      expect(limiter.hasAvailableToken).toHaveBeenCalledWith(account);
    });

    it('should throw an 429 exception when the limit is exceeded return.', async () => {
      limiter.hasAvailableToken = jest.fn().mockResolvedValue(false);

      const account: Account = { provider: 'test', ref: () => 'test' };

      await expect(async () => await guard.canActivate(createFakeContext(account))).rejects.toThrow(HttpException);
    });
  });
});
