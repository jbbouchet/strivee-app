/**
 * The Aggregate is a collection of entities.
 *
 * @template E The type of entities in the Aggregate.
 */
export interface Aggregate<E> {
  /**
   * The set of entities retrieved.
   */
  entities: () => E[];

  /**
   * The count of entities retrieved.
   */
  count: () => number;
}

/**
 * The Aggregator can be used to build entity aggregations from different sources.
 *
 * @template E - The type of entities being aggregated.
 * @template O - The type of options used to build the aggregation.
 */
export interface Aggregator<E, O = any> {
  /**
   * Build an entity aggregation.
   * @param options - Options used to build the result of the aggregation.
   */
  createAggregate: (options: O) => Promise<Aggregate<E>>;
}
