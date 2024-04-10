import { Account, TokenRateLimiter, TokenRateLimiterConfig } from '@strivee-api/security';

export class InMemoryTokenRateLimiter implements TokenRateLimiter {
  private readonly store = new Map<string, number>();

  private get defaultTokenCount() {
    return this.config.defaultTokenCount;
  }

  constructor(private readonly config: TokenRateLimiterConfig) {}

  /**
   * @inheritDoc
   */
  public async hasAvailableToken(account: Account): Promise<boolean> {
    const count = this.getCount(account);
    return count > 0;
  }

  /**
   * @inheritDoc
   */
  public async decreaseTokenCount(account: Account, count?: number): Promise<number> {
    let current = this.getCount(account);

    if (typeof count !== 'number' || !Number.isFinite(count)) {
      count = 1;
    }
    // Prevent float values
    count = Math.round(count);

    current = current - count;

    // Prevent negative value
    if (current < 0) {
      current = 0;
    }

    this.setCount(account, current);
    return current;
  }

  /**
   * @inheritDoc
   */
  public getAvailableTokenCount(account: Account): Promise<number> {
    return Promise.resolve(this.getCount(account));
  }

  /**
   * Get the stored count or the default count of token for an account.
   * @param account - The account
   * @private
   */
  private getCount(account: Account): number {
    const key = `${account.provider}:${account.ref()}`;

    let count = this.store.get(key);

    if (count === undefined) {
      count = this.defaultTokenCount;
    }

    return count;
  }

  /**
   * Store the current token count in the memory store.
   * @param account - The account
   * @param count - The token count
   * @private
   */
  private setCount(account: Account, count: number) {
    const key = `${account.provider}:${account.ref()}`;
    this.store.set(key, count);
  }
}
