import { RecruitingCompanyAggregator } from '@strivee-api/company/infrastructure/aggregator';
import {
  AggregateSourceInValidResult,
  AggregateSourceValidResult,
  AGGREGATION_STATE,
  AggregatorSource,
  NoAggregationReadySourceError,
  NoValidAggregationSourceResultError,
} from '@strivee-api/core';
import Mock = jest.Mock;

describe('Application/Company/RecruitingCompanyAggregator', () => {
  let aggregator: RecruitingCompanyAggregator;
  let source: AggregatorSource<any>;

  beforeEach(() => {
    source = {
      isReady: jest.fn().mockReturnValue(true),
      createAggregate: jest.fn(),
    };

    aggregator = new RecruitingCompanyAggregator();
  });

  it('should be defined', () => {
    expect(aggregator).toBeDefined();
  });

  describe('=> addSource() method', () => {
    it('should return the current aggregator', () => {
      const instance = aggregator.addSource(source);
      expect(instance).toBe(aggregator);
    });
  });

  describe('=> createAggregate() method', () => {
    it('should return a aggregate with entities provided by sources', async () => {
      const companies = [{ name: 'My company' }];

      const result: AggregateSourceValidResult<any> = {
        provider: 'my-custom-provider',
        state: AGGREGATION_STATE.VALID,
        entities: () => companies,
        count: () => companies.length,
      };

      source.createAggregate = jest.fn().mockResolvedValue(result);

      aggregator.addSource(source);

      const aggregate = await aggregator.createAggregate({});

      expect(aggregate).toBeTruthy();
      expect(aggregate.entities()).toStrictEqual(companies);
      expect(aggregate.count()).toBe(companies.length);
      expect(source.createAggregate as Mock).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when no source is ready', async () => {
      source.isReady = jest.fn().mockReturnValue(false);

      aggregator.addSource(source);

      await expect(async () => await aggregator.createAggregate({})).rejects.toThrow(NoAggregationReadySourceError);
      expect(source.isReady as Mock).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when the source result is invalid', async () => {
      const result: AggregateSourceInValidResult = {
        provider: 'my-custom-provider',
        state: AGGREGATION_STATE.INVALID,
        reason: () => ({ message: 'unknown' }),
      };

      source.createAggregate = jest.fn().mockResolvedValue(result);

      aggregator.addSource(source);

      await expect(async () => await aggregator.createAggregate({})).rejects.toThrow(
        NoValidAggregationSourceResultError,
      );
      expect(source.createAggregate as Mock).toHaveBeenCalledTimes(1);
    });
  });
});
