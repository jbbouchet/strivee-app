import { AGGREGATION_STATE } from '../state';
import { Aggregate } from './aggregator';


/**
 * The result of an aggregator source.
 */
export interface AggregatorSourceResult {
  /**
   * The aggregate source name.
   */
  readonly provider: string | symbol;

  /**
   * Determine if the aggregation request has succeeded or failed.
   */
  readonly state: AGGREGATION_STATE;
}

/**
 * Represents the valid result of aggregating.
 *
 * @template E - The type of elements in the aggregate.
 */
export interface AggregateSourceValidResult<E> extends AggregatorSourceResult, Aggregate<E> {
  /**
   * Determine that the aggregate result is valid.
   */
  readonly state: AGGREGATION_STATE.VALID;
}

/**
 * Represents the result when an error occurs during the aggregation.
 *
 * @template E - The type of elements in the aggregate.
 */
export interface AggregateSourceInValidResult extends AggregatorSourceResult {
  /**
   * Determine that the aggregate result is invalid.
   */
  readonly state: AGGREGATION_STATE.INVALID;

  /**
   * The reason why the aggregate result is invalid.
   */
  reason: () => { message: string; code?: number; cause?: any };
}
