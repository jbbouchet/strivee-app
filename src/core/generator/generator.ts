/**
 * Represents a generator that can be used to generate entities.
 */
export interface Generator<E> {
  /**
   * Generates a new entity.
   */
  generate: () => E;

  /**
   * Generate an array of entities based on the specified count.
   *
   * @param count - The number of entities to retrieve from the feed.
   * @returns  An array containing the requested entities.
   */
  feed: (count: number) => Array<E>;
}
