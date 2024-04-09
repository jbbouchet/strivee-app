export abstract class FranceTravailAuthConfig {
  /**
   * Mode of renewal for the authentication token.
   */
  public abstract readonly renewStrategy: 'autoRenew' | 'onDemand';

  /**
   * Identifier of the application in the francetravail.io system.
   */
  public abstract readonly clientId: string;

  /**
   * Secret of the application in the francetravail.io system.
   */
  public abstract readonly clientSecret: string;
}
