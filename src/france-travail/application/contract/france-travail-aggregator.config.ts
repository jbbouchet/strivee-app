export abstract class FranceTravailAggregatorConfig {
  /**
   * The number of requests allowed per second,
   * undefined if the API has no limit.
   */
  public abstract readonly apiRateLimit: number | undefined;
}
