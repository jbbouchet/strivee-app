export interface FranceTravailRecruitingCompany {
  /**
   * The physical address of the company.
   */
  address: string;

  /**
   * The company accepts or does not accept applications for work-study programs.
   */
  alternance: boolean;

  /**
   * The locality where the company is located.
   */
  city: string;

  /**
   * The preferred mode of contact to reach the company.
   */
  contact_mode: string;

  /**
   * Distance from the requested geographical point (in kilometers).
   */
  distance: number;

  /**
   * Label for the number of employees for this company.
   */
  headcount_text: string;

  /**
   *  The geographical latitude of the address.
   */
  lat: number;

  /**
   * The geographical longitude of the address.
   */
  lon: number;

  /**
   * Code of the most relevant ROME
   */
  matched_rome_code: string;

  /**
   * Label of the most relevant ROME
   */
  matched_rome_label: string;

  /**
   * Slug of the most relevant ROME
   */
  matched_rome_slug: string;

  /**
   * The French NAF code
   */
  naf: string;

  /**
   * The French NAF label associated with naf code.
   */
  naf_text: string;

  /**
   * The name (raison sociale) of the company.
   */
  name: string;

  /**
   * The Unique French identification number of companies.
   */
  siret: string;

  /**
   * Link to the social network of company.
   */
  social_network: string;

  /**
   * A number between 0 and 5 representing the probability for this company to recruit soon.
   */
  stars: number;

  /**
   * La bonne boite company link.
   */
  url: string;

  /**
   * The company's website url.
   */
  website: string;
}
