/**
 * Represents the options that can be used
 * to create the list of recruiting companies.
 */
export interface RecruitingSearchOptions {
  /**
   * The sought business category.
   */
  job?: string;

  /**
   * The sought postal code.
   */
  postalCode?: string;

  /**
   * The sought locality.
   * @type {string}
   */
  locality?: string;
}
