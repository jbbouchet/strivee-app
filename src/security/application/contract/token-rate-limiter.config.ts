/**
 * Represents the configuration settings for a token rate limiter.
 */
export abstract class TokenRateLimiterConfig {
  /**
   * The default count of the token available by default for each account.
   */
  public abstract defaultTokenCount: number;
}
