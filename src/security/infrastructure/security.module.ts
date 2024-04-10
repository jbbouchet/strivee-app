import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenRateLimiter, TokenRateLimiterConfig } from '@strivee-api/security';
import securityConfig from './config';
import { createTokenRateLimiterConfig } from './factory';
import { InMemoryTokenRateLimiter } from './service';

@Module({
  imports: [ConfigModule.forFeature(securityConfig)],
  providers: [
    {
      provide: TokenRateLimiterConfig,
      useFactory: (s: ConfigService) => createTokenRateLimiterConfig(s),
      inject: [ConfigService],
    },
    {
      provide: TokenRateLimiter,
      useFactory: (c: TokenRateLimiterConfig) => new InMemoryTokenRateLimiter(c),
      inject: [TokenRateLimiterConfig],
    },
  ],
  exports: [TokenRateLimiter],
})
export class SecurityModule {}
