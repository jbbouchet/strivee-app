import { Account } from '@strivee-api/security';


/**
 * TokenRateLimiter is an abstract class that provides methods to check the availability of tokens for an account,
 * retrieve the number of available tokens, and decrease the token count for an account.
 */
export abstract class TokenRateLimiter {
  /**
   * Checks if the account still has tokens available.
   * @param account - The account to test.
   */
  public abstract hasAvailableToken(account: Account): Promise<boolean>;

  /**
   * Retrieves the number of tokens still available for the account.
   * @param account - The account.
   */
  public abstract getAvailableTokenCount(account: Account): Promise<number>;

  /**
   * Reduces the number of available tokens for the account
   * @param account - The account.
   * @param count - The number of tokens to remove.
   * @return The new token count.
   */
  public abstract decreaseTokenCount(account: Account, count?: number): Promise<number>;
}
