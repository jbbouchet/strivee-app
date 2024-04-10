import { Module } from '@nestjs/common';
import { TokenRateLimiter } from '@strivee-api/security';
import { InMemoryTokenRateLimiter } from './service';

@Module({
  providers: [
    {
      provide: TokenRateLimiter,
      useValue: new InMemoryTokenRateLimiter(),
    },
  ],
  exports: [TokenRateLimiter],
})
export class SecurityModule {}
