/**
 * Represents a Job parsed from a CSV file.
 */
export interface CsvJobRow {
  /**
   * The job label.
   */
  libelle_appellation_long: string;

  /**
   * The unique Rome code.
   */
  code_rome: string;
}
