import { Address } from '@strivee-api/geo';


/**
 * Interface representing a Company.
 */
export interface Company {
  /**
   * The name of the company.
   */
  name: string;

  /**
   * The Unique French identification number of companies.
   */
  siret: string;

  /**
   * The physical address of the company.
   */
  address: Address;

  /**
   * Label for the number of employees for this company.
   */
  headcountText?: string;

  /**
   * The French NAF code that defines the type of activity of the company.
   */
  naf?: string;
}
