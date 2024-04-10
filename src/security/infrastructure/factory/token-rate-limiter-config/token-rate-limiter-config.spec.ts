import { ConfigService } from '@nestjs/config';
import { createTokenRateLimiterConfig } from '@strivee-api/security/infrastructure/factory';

describe('@Infrastructure/Security/createTokenRateLimiterConfig', () => {
  let config: ConfigService;

  beforeEach(() => {
    const configService: Pick<ConfigService, 'getOrThrow'> = {
      getOrThrow: jest.fn().mockReturnValue(100),
    };
    config = configService as ConfigService;
  });

  it('should return a TokenRateLimiterConfig', () => {
    const result = createTokenRateLimiterConfig(config);
    expect(result.defaultTokenCount).toBeDefined();
  });

  it('should return the value from "security.defaultTokenCount"', () => {
    const result = createTokenRateLimiterConfig(config);
    expect(result.defaultTokenCount).toBe(100);
    expect(config.getOrThrow).toHaveBeenCalledWith('security.defaultTokenCount');
  });
});
