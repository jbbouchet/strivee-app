import {
  AggregateSourceInValidResult,
  AggregateSourceValidResult,
  AGGREGATION_STATE,
  AggregatorSourceResult,
  isAnAggregateSourceInvalidResult,
  isAnAggregateSourceValidResult,
} from '@strivee-api/core';
import { isAValidAggregatorSourceProvider, isMaybeAnAggregatorSourceResult } from './aggregate-validity.validator';

describe('@Application/Company/AggregateValidity', () => {
  describe('# isAValidAggregateProviderType() function', () => {
    it('should return true when the provider is a string', () => {
      expect(isAValidAggregatorSourceProvider('my-custom-provider')).toBe(true);
    });

    it('should return true when the provider is a symbol', () => {
      const provider = Symbol('my-custom-provider');
      expect(isAValidAggregatorSourceProvider(provider)).toBe(true);
    });

    it('should return false when the provider is an empty string', () => {
      const provider = Symbol('my-custom-provider');
      expect(isAValidAggregatorSourceProvider(provider)).toBe(true);
    });

    it('should return false for providers that are not valid aggregate provider', () => {
      expect(isAValidAggregatorSourceProvider(null)).toBe(false);
      expect(isAValidAggregatorSourceProvider(undefined)).toBe(false);
      expect(isAValidAggregatorSourceProvider(123)).toBe(false);
      expect(isAValidAggregatorSourceProvider({})).toBe(false);
      expect(isAValidAggregatorSourceProvider([])).toBe(false);
    });
  });

  describe('# isMaybeAnAggregate() function', () => {
    it('should return true when the aggregate implements the RecruitingCompanyAggregate interface', () => {
      const aggregate: AggregatorSourceResult = {
        provider: 'my-custom-provider',
        state: AGGREGATION_STATE.VALID,
      };

      expect(isMaybeAnAggregatorSourceResult(aggregate)).toBe(true);
    });

    it('should return false when the provider property is missing', () => {
      const aggregate: Pick<AggregatorSourceResult, 'state'> = {
        state: AGGREGATION_STATE.VALID,
      };

      expect(isMaybeAnAggregatorSourceResult(aggregate)).toBe(false);
    });

    it('should return false when the state property is missing', () => {
      const aggregate: Pick<AggregatorSourceResult, 'provider'> = {
        provider: 'my-custom-provider',
      };

      expect(isMaybeAnAggregatorSourceResult(aggregate)).toBe(false);
    });

    it('should return false when the provider property is invalid', () => {
      const aggregate: Record<keyof AggregatorSourceResult, any> = {
        provider: 12345,
        state: AGGREGATION_STATE.VALID,
      };

      expect(isMaybeAnAggregatorSourceResult(aggregate)).toBe(false);
    });

    it('should return false when the state property is invalid', () => {
      const aggregate: Record<keyof AggregatorSourceResult, any> = {
        provider: 'my-custom-provider',
        state: 'not-a-valid-aggregate-state',
      };

      expect(isMaybeAnAggregatorSourceResult(aggregate)).toBe(false);
    });

    it('should return false for invalid aggregate values', () => {
      expect(isMaybeAnAggregatorSourceResult(null)).toBe(false);
      expect(isMaybeAnAggregatorSourceResult(undefined)).toBe(false);
      expect(isMaybeAnAggregatorSourceResult(123)).toBe(false);
      expect(isMaybeAnAggregatorSourceResult({})).toBe(false);
      expect(isMaybeAnAggregatorSourceResult([])).toBe(false);
    });
  });

  describe('# isAnAggregateSourceValidResult() function ', () => {
    it('should return true for a valid AggregateSourceValidResult object', () => {
      const validResult: AggregateSourceValidResult<any> = {
        provider: 'my-custom-provider',
        state: AGGREGATION_STATE.VALID,
        entities: () => [],
        count: () => 0,
      };
      expect(isAnAggregateSourceValidResult(validResult)).toBe(true);
    });

    it('should return false for an object missing the entities function', () => {
      const invalidResult: Omit<AggregateSourceValidResult<any>, 'entities'> = {
        provider: 'my-custom-provider',
        state: AGGREGATION_STATE.VALID,
        count: () => 0,
      };
      expect(isAnAggregateSourceValidResult(invalidResult)).toBe(false);
    });

    it('should return false for an object missing the count function', () => {
      const missingCountResult: Omit<AggregateSourceValidResult<any>, 'count'> = {
        provider: 'my-custom-provider',
        state: AGGREGATION_STATE.VALID,
        entities: () => [],
      };
      expect(isAnAggregateSourceValidResult(missingCountResult)).toBe(false);
    });

    it('should return false for an object with an invalid state', () => {
      const invalidStateResult = {
        provider: 'my-custom-provider',
        state: AGGREGATION_STATE.INVALID,
        entities: () => [],
        count: () => 0,
      };
      expect(isAnAggregateSourceValidResult(invalidStateResult)).toBe(false);
    });
  });

  describe('# isAnAggregateSourceInvalidResult() function', () => {
    it('should return true for an object representing an invalid aggregate source result', () => {
      const invalidResult = {
        provider: 'my-custom-provider',
        state: AGGREGATION_STATE.INVALID,
        reason: () => ({}),
      };
      expect(isAnAggregateSourceInvalidResult(invalidResult)).toBe(true);
    });

    it('should return false for an object not representing an invalid aggregate source result due to missing reason', () => {
      const incompleteResult: Omit<AggregateSourceInValidResult, 'reason'> = {
        provider: 'my-custom-provider',
        state: AGGREGATION_STATE.INVALID,
      };

      expect(isAnAggregateSourceInvalidResult(incompleteResult)).toBe(false);
    });

    it('should return false for an object with a valid state', () => {
      const wrongStateResult = {
        provider: 'my-custom-provider',
        state: AGGREGATION_STATE.VALID,
        reason: () => ({}),
      };
      expect(isAnAggregateSourceInvalidResult(wrongStateResult)).toBe(false);
    });

    it('should return false for an object with reason not being a function', () => {
      const invalidReasonResult: Record<keyof AggregateSourceInValidResult, any> = {
        provider: 'my-custom-provider',
        state: AGGREGATION_STATE.INVALID,
        reason: 'invalid-result',
      };
      expect(isAnAggregateSourceInvalidResult(invalidReasonResult)).toBe(false);
    });
  });
});
