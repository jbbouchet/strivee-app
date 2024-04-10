import { ConfigService } from '@nestjs/config';
import { FranceTravailAuthConfig } from '@strivee-api/france-travail';

export function createFranceTravailAuthConfig(service: ConfigService): FranceTravailAuthConfig {
  return {
    clientId: service.getOrThrow('francetravail.clientId'),
    clientSecret: service.getOrThrow('francetravail.clientSecret'),
    renewStrategy: 'autoRenew',
  };
}
