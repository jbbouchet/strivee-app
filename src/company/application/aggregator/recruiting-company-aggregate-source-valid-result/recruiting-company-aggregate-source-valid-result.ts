import { RecruitingCompany } from '@strivee-api/company';
import { AggregateSourceValidResult, AGGREGATION_STATE, AggregatorSourceResult } from '@strivee-api/core';

export class RecruitingCompanyAggregateSourceValidResult implements AggregateSourceValidResult<RecruitingCompany> {
  /**
   * @inheritDoc
   */
  public readonly provider: string | symbol;

  /**
   * @inheritDoc
   */
  public readonly state = AGGREGATION_STATE.VALID;

  /**
   * The stored companies.
   * @private
   */
  private companies: RecruitingCompany[];

  constructor(provider: AggregatorSourceResult['provider'], companies?: RecruitingCompany[]) {
    this.provider = provider;
    this.companies = Array.isArray(companies) ? companies : [];
  }

  /**
   * Store the companies as the result entities.
   * @param companies
   */
  public setCompanies(companies: RecruitingCompany[]) {
    this.companies = [...companies];
  }

  /**
   * @inheritDoc
   */
  public entities(): RecruitingCompany[] {
    return [...this.companies];
  }

  /**
   * @inheritDoc
   */
  public count(): number {
    return this.companies.length;
  }
}
