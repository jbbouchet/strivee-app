import { Account, TokenRateLimiter } from '@strivee-api/security';

export class TokenRateLimiterMock implements TokenRateLimiter {
  public readonly store = new Map<Account, number>();

  public decreaseTokenCount = jest.fn().mockImplementation((account: Account, count?: number): Promise<number> => {
    let current = this.store.get(account) ?? 0;
    count = Number.isFinite(count) ? count : 1;
    current = current - count >= 0 ? current - count : 0;

    this.store.set(account, current);
    return Promise.resolve(current);
  });

  public getAvailableTokenCount = jest.fn().mockImplementation((account: Account): Promise<number> => {
    const count = this.store.get(account);
    return Promise.resolve(count);
  });

  public hasAvailableToken = jest.fn().mockImplementation((account: Account): Promise<boolean> => {
    const count = this.store.get(account);
    return Promise.resolve(!!count);
  });
}
