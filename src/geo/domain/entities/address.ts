/**
 * Represents a physical address.
 */
export interface Address {
  /**
   * Represents the full text value.
   */
  full: string;

  /**
   * The locality of the address.
   */
  locality: string;

  /**
   *  The geographical latitude of the address.
   */
  lat: number;

  /**
   * The geographical longitude of the address.
   */
  lng: number;
}
