import { Company } from '@strivee-api/company';

export interface RecruitingCompany extends Company {
  /**
   * The preferred mode of contact to reach the company.
   */
  contactMode: string;

  /**
   * The company accepts or does not accept applications for work-study programs.
   */
  alternance: boolean;

  /**
   * Distance from the requested geographical point (in kilometers).
   */
  distance?: number;
}