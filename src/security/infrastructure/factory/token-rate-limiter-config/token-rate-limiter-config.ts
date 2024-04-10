import { ConfigService } from '@nestjs/config';
import { TokenRateLimiterConfig } from '@strivee-api/security';


/**
 * Creates a TokenRateLimiterConfig object based on the provided configuration.
 *
 * @param config - The ConfigService object used to retrieve configuration values.
 */
export function createTokenRateLimiterConfig(config: ConfigService): TokenRateLimiterConfig {
  return {
    defaultTokenCount: config.getOrThrow<number>('security.defaultTokenCount'),
  };
}
