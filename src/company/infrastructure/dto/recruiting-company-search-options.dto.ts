import { RecruitingSearchOptions } from '@strivee-api/company';

export class RecruitingCompanySearchOptionsDto implements RecruitingSearchOptions {
  /**
   * The sought business category.
   */
  public job?: string;

  /**
   * The sought postal code.
   */
  public postalCode?: string;

  /**
   * The sought locality.
   */
  public locality?: string;
}
