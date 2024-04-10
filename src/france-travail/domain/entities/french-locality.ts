import { Locality } from '@strivee-api/geo';


/**
 * Represents a French locality with additional INSEE code.
 * @interface
 * @extends Locality
 */
export interface FrenchLocality extends Locality {
  /**
   * A unique code defined by the INSEE institute.
   */
  inseeCode: string;
}
