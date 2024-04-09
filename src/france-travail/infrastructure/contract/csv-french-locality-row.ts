/**
 * Represents a French locality parsed from a CSV file.
 * @interface CsvFrenchLocality
 */
export interface CsvFrenchLocality {
  /**
   * A unique code defined by the INSEE institute.
   */
  code_insee: string;

  /**
   * The name of the locality.
   */
  nom: string;

  /**
   * The postal code of the locality.
   */
  code_postal: string;
}
