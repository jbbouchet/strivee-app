import { HttpService } from '@nestjs/axios';
import { AggregateSourceInValidResult, AggregateSourceValidResult, AGGREGATION_STATE } from '@strivee-api/core';
import { FranceTravailAggregatorConfig } from '@strivee-api/france-travail';
import { FranceTravailAggregateSource } from '@strivee-api/france-travail/infrastructure/aggregator';
import { TypeormFrenchLocalityEntity, TypeormJobEntity } from '@strivee-api/france-travail/infrastructure/datastore/typeorm';
import { FranceTravailAuthenticator } from '@strivee-api/france-travail/infrastructure/security';
import { of, throwError } from 'rxjs';
import { Repository } from 'typeorm';

describe('@Infrastructure/FranceTravail/FranceTravailAggregateSource', () => {
  let source: FranceTravailAggregateSource;
  let localityRepository: Pick<Repository<TypeormFrenchLocalityEntity>, 'createQueryBuilder'>;
  let jobRepository: Pick<Repository<TypeormJobEntity>, 'createQueryBuilder'>;
  let config: FranceTravailAggregatorConfig;
  let authenticator: Pick<FranceTravailAuthenticator, 'getToken'>;
  let httpService: Pick<HttpService, 'get'>;

  beforeEach(async () => {
    config = {
      apiRateLimit: undefined,
    };

    authenticator = {
      getToken: jest.fn().mockResolvedValue({ authorization: 'Bearer bearer-token' }),
    };

    httpService = {
      get: jest.fn(),
    };

    source = new FranceTravailAggregateSource(
      localityRepository as Repository<TypeormFrenchLocalityEntity>,
      jobRepository as Repository<TypeormJobEntity>,
      config,
      authenticator as FranceTravailAuthenticator,
      httpService as HttpService,
    );
  });

  it('should be defined', () => {
    expect(source).toBeDefined();
  });

  describe('=> isReady() method', () => {
    it('should return true if apiRateLimit is undefined in config', () => {
      (config.apiRateLimit as any) = undefined;

      expect(source.isReady()).toBe(true);
    });

    it('should return true if the request count is lower than apiRateLimit', () => {
      (config.apiRateLimit as any) = 100;
      expect(source.isReady()).toBe(true);
    });
  });

  describe('=> createAggregate() method', () => {
    it('should return a valid result with companies fetched from the external api', async () => {
      httpService.get = jest.fn().mockReturnValue(of({ data: { companies: [] } }));

      const result = await source.createAggregate({ job: '' });
      expect(authenticator.getToken).toHaveBeenCalled();

      expect(result.state).toBe(AGGREGATION_STATE.VALID);
      expect((result as AggregateSourceValidResult<any>).entities()).toBeInstanceOf(Array);
    });

    it('should return an invalid result when external api emit an error', async () => {
      httpService.get = jest.fn().mockReturnValue(
        throwError(() => ({
          response: { data: 'France travail API error' },
        })),
      );

      const result = await source.createAggregate({ job: '' });

      expect(result.state).toBe(AGGREGATION_STATE.INVALID);
      expect((result as AggregateSourceInValidResult).reason()).toStrictEqual({
        message: 'France travail API error',
        code: 0,
      });
    });
  });
});
