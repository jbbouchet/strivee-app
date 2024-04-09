import { AggregatorSourceResult } from './aggregator-source-result';


/**
 * An aggregator source that can perform creates aggregates.
 *
 * @template E - The type of the elements in the aggregator source.
 * @template O - The type of the option parameter for creating aggregates.
 */
export interface AggregatorSource<E, O = any> {
  /**
   * Determines if the source is ready to perform searches.
   */
  isReady: () => boolean;

  /**
   *
   * @param options - options to
   */
  createAggregate: (options: O) => Promise<AggregatorSourceResult>;
}
