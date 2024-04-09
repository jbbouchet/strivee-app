import { ConfigService } from '@nestjs/config';
import { FranceTravailAggregatorConfig } from '@strivee-api/france-travail';

export function createFranceTravailAggregatorSourceConfig(service: ConfigService): FranceTravailAggregatorConfig {
  return {
    apiRateLimit: service.get('francetravail.labonneboite.rateLimit'),
  };
}
