import { faker } from '@faker-js/faker/locale/fr';
import { HttpService } from '@nestjs/axios';
import { FranceTravailAuthConfig } from '@strivee-api/france-travail';
import { FranceTravailAuthResponse } from '@strivee-api/france-travail/infrastructure/contract';
import { of } from 'rxjs';
import { FranceTravailAuthenticator } from './france-travail.authenticator';
import Mock = jest.Mock;

describe('@Infrastructure/FranceTravail/FranceTravailAuthenticator', () => {
  let authenticator: FranceTravailAuthenticator;
  let config: FranceTravailAuthConfig;
  let httpService: Pick<HttpService, 'post'>;

  beforeEach(async () => {
    config = {
      clientId: 'client-id',
      clientSecret: 'client-secret',
      renewStrategy: 'onDemand',
    };

    httpService = {
      post: jest.fn(),
    };

    authenticator = new FranceTravailAuthenticator(config, httpService as HttpService);
  });

  it('should be defined', () => {
    expect(authenticator).toBeDefined();
  });

  describe('=> getToken() method', () => {
    it('should return the value from http request', async () => {
      const accessToken = 'my-custom-access-token';
      let response: FranceTravailAuthResponse = {
        access_token: accessToken,
        expires_in: 60 * 1000,
        scope: 'custom-scope',
        token_type: 'bearer',
      };

      httpService.post = jest.fn().mockReturnValue(of({ data: response }));

      const token = await authenticator.getToken();

      expect(token.type).toBe(response.token_type);
      expect(token.value).toBe(response.access_token);
      expect(token.authorization).toBe(`Bearer ${accessToken}`);

      expect(httpService.post).toHaveBeenCalled();

      expect((httpService.post as Mock).mock.lastCall[1]).toStrictEqual({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        grant_type: 'client_credentials',
        scope: 'api_labonneboitev1',
      });
    });

    it('should return the cached token', async () => {
      httpService.post = jest.fn().mockImplementation(() => {
        const response: FranceTravailAuthResponse = {
          access_token: faker.string.alphanumeric(50),
          expires_in: 60 * 1000,
          scope: 'custom-scope',
          token_type: 'bearer',
        };

        return of({ data: response });
      });

      // First call
      const first = await authenticator.getToken();

      // Second call
      const second = await authenticator.getToken();

      expect(httpService.post).toHaveBeenCalledTimes(1);
      expect(second.value).toBe(first.value);
    });

    it('should thrown an error when the token type is unknown', async () => {
      let response: FranceTravailAuthResponse = {
        access_token: 'my-custom-access-token',
        expires_in: 60 * 1000,
        scope: 'custom-scope',
        token_type: 'basic',
      };

      httpService.post = jest.fn().mockReturnValue(of({ data: response }));

      await expect(async () => await authenticator.getToken()).rejects.toThrow();
    });
  });
});
