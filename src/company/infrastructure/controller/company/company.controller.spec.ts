import { Test, TestingModule } from '@nestjs/testing';
import { RecruitingSearchOptions } from '@strivee-api/company';
import { RecruitingCompanyAggregator } from '@strivee-api/company/infrastructure/aggregator';
import { FakeRecruitingCompanyGenerator } from '@strivee-api/company/infrastructure/generator';
import { Aggregator, NoValidAggregationSourceResultError } from '@strivee-api/core';
import { Account, TokenRateLimiter } from '@strivee-api/security';
import { TokenRateLimiterMock } from '@strivee-api/test/utils/token-rate-limiter.mock';
import { CompanyController } from './company.controller';

describe('CompanyController', () => {
  let controller: CompanyController;
  let tokenRateProvider: TokenRateLimiterMock;
  let aggregator: Aggregator<any>;
  let account: Account;

  const generator = new FakeRecruitingCompanyGenerator();

  beforeEach(async () => {
    account = {
      provider: 'test',
      ref: () => 'test',
    };

    aggregator = {
      createAggregate: jest.fn().mockResolvedValue({ entities: () => generator.feed(5) }),
    };

    tokenRateProvider = new TokenRateLimiterMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: RecruitingCompanyAggregator,
          useValue: aggregator,
        },
        {
          provide: TokenRateLimiter,
          useValue: tokenRateProvider,
        },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('=> list() method', () => {
    it('should return a successfully result', async () => {
      const result = await controller.list(account, { job: 'test' });
      expect(result.success).toBe(true);
      expect(result.companies).toBeInstanceOf(Array);
    });

    it('should return the aggregate entities ', async () => {
      const company = generator.generate();

      aggregator.createAggregate = jest.fn().mockResolvedValue({ entities: () => [company] });

      const options: RecruitingSearchOptions = { job: 'test', postalCode: '21000' };

      const result = await controller.list(account, options);

      expect(aggregator.createAggregate).toHaveBeenCalledWith(options);
      expect(result.companies).toBeInstanceOf(Array);
      expect(result.companies.length).toBe(1);
      expect(result.companies[0]).toBe(company);
    });

    it('should return the token count - 1 ', async () => {
      tokenRateProvider.store.set(account, 12);

      const result = await controller.list(account, { job: 'test' });
      expect(result.availableToken).toBe(11);
      expect(tokenRateProvider.decreaseTokenCount).toHaveBeenCalledWith(account);
    });

    it('should return a falsy result when the aggregate throw a NoValidAggregationSourceResultError', async () => {
      aggregator.createAggregate = jest.fn().mockRejectedValue(new NoValidAggregationSourceResultError());

      const result = await controller.list(account, { job: 'test' });
      expect(result.success).toBe(false);
    });

    it('should not reduce the number of tokens if the call fails.', async () => {
      tokenRateProvider.store.set(account, 10);
      aggregator.createAggregate = jest.fn().mockRejectedValue(new NoValidAggregationSourceResultError());

      const result = await controller.list(account, { job: 'test' });
      expect(result.availableToken).toBe(10);
    });

    it('should propagate unknown errors.', async () => {
      const error = new Error('unknown error');
      aggregator.createAggregate = jest.fn().mockRejectedValue(error);

      await expect(async () => await controller.list(account, { job: 'test' })).rejects.toThrow(error);
    });
  });
});
