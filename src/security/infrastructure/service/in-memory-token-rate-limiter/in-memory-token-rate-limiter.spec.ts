import { Account } from '@strivee-api/security';
import { InMemoryTokenRateLimiter } from '@strivee-api/security/infrastructure/service';

describe('@Infrastructure/security/InMemoryTokenRateLimiter', () => {
  let limiter: InMemoryTokenRateLimiter;
  let account: Account;

  beforeEach(() => {
    limiter = new InMemoryTokenRateLimiter({ defaultTokenCount: 10 });
    account = {
      provider: 'my-custom-provider',
      ref: () => 'test',
    };
  });

  it('should start with default token count', async () => {
    const tokens = await limiter.getAvailableTokenCount(account);
    expect(tokens).toBe(10);
  });

  it('should decrease token count correctly', async () => {
    await limiter.decreaseTokenCount(account, 1);
    const tokens = await limiter.getAvailableTokenCount(account);
    expect(tokens).toBe(9);
  });

  it('should decrease by 1 if the provided account is not a valid number.', async () => {
    await limiter.decreaseTokenCount(account, NaN);
    const tokens = await limiter.getAvailableTokenCount(account);
    expect(tokens).toBe(9);
  });

  it('should not allow token count to go negative', async () => {
    await limiter.decreaseTokenCount(account, 100);
    const tokens = await limiter.getAvailableTokenCount(account);
    expect(tokens).toBe(0);
  });

  describe('=> hasAvailableToken() method', () => {
    it('should return true when tokens are available', async () => {
      const hasToken = await limiter.hasAvailableToken(account);
      expect(hasToken).toBe(true);
    });

    it(' should return false when no tokens are left', async () => {
      const count = await limiter.getAvailableTokenCount(account);

      await limiter.decreaseTokenCount(account, count + 1);
      const hasToken = await limiter.hasAvailableToken(account);
      expect(hasToken).toBe(false);
    });
  });
});
