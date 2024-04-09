import {
  AggregateSourceInValidResult,
  AggregateSourceValidResult,
  AGGREGATION_STATE,
  AggregatorSourceResult,
} from '@strivee-api/core';
import { isAggregationState } from '../is-aggregate-state/is-aggregation-state.validator';


/**
 * Tests if the provider has the same type as declared in the `RecruitingCompanyAggregate` interface.
 * @param provider - The provider to test.
 * @return True if the provider is a non-empty string or a symbol.
 */
export function isAValidAggregatorSourceProvider(provider: any): provider is AggregatorSourceResult['provider'] {
  return (typeof provider === 'string' && provider !== '') || typeof provider === 'symbol';
}

/**
 * Tests if the provided object implements the `AggregatorSourceResult` interface
 * @param result - The object to test.
 * @return True if the result is a `AggregatorSourceResult` instance, false otherwise.
 */
export function isMaybeAnAggregatorSourceResult(result: any): result is AggregatorSourceResult {
  return (
    typeof result === 'object' &&
    result !== null &&
    isAValidAggregatorSourceProvider((result as AggregatorSourceResult).provider) &&
    isAggregationState((result as AggregatorSourceResult).state)
  );
}

/**
 * Tests if the provided object implements the `AggregateSourceValidResult` interface
 * @param result - The object to test.
 * @return True if the result is a `AggregateSourceValidResult` instance, false otherwise.
 */
export function isAnAggregateSourceValidResult<E = any>(result: any): result is AggregateSourceValidResult<E> {
  return (
    isMaybeAnAggregatorSourceResult(result) &&
    (result as AggregateSourceValidResult<E>).state === AGGREGATION_STATE.VALID &&
    typeof (result as AggregateSourceValidResult<E>).entities === 'function' &&
    typeof (result as AggregateSourceValidResult<E>).count === 'function'
  );
}

/**
 * Tests if the provided object implements the `AggregateSourceInValidResult` interface
 * @param result - The object to test.
 * @return True if the result is a `AggregateSourceInValidResult` instance, false otherwise.
 */
export function isAnAggregateSourceInvalidResult(result: any): result is AggregateSourceInValidResult {
  return (
    isMaybeAnAggregatorSourceResult(result) &&
    (result as AggregateSourceInValidResult).state === AGGREGATION_STATE.INVALID &&
    typeof (result as AggregateSourceInValidResult).reason === 'function'
  );
}
