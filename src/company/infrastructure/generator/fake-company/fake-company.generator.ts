import { faker } from '@faker-js/faker/locale/fr';
import { Company } from '@strivee-api/company';
import { Generator } from '@strivee-api/core';
import { Address } from '@strivee-api/geo';
import { FakeAddressGenerator } from '@strivee-api/geo/infrastructure/generator';


/**
 * Use this class to generate `Company` using the Fakejs lib.
 * Only use this class in development environment.
 */
export class FakeCompanyGenerator implements Generator<Company> {
  /**
   * Generator used to generate company address.
   * @private
   */
  private readonly addressGenerator: Generator<Address>;

  constructor(addressGenerator?: Generator<Address>) {
    this.addressGenerator = addressGenerator ?? new FakeAddressGenerator();
  }

  /**
   * @inheritDoc
   */
  public generate(): Company {
    const name = faker.company.name();

    return {
      name,
      address: this.addressGenerator.generate(),
      headcountText: this.generateHeadCountText(),
      naf: this.getRandomNafCode(),
      siret: this.generateSiret(),
    };
  }

  /**
   * @inheritDoc
   */
  public feed(count: number): Array<Company> {
    return Array.from({ length: count }, () => this.generate());
  }

  /**
   * Generate a string composed of 14 numeric characters representing a SIRET number.
   * @private
   * @return {string} - A SIRET number.
   */
  private generateSiret(): string {
    let siret = '';

    for (let i = 0; i < 14; i++) {
      siret += faker.number.int({ min: 0, max: 9 }).toString();
    }
    return siret;
  }

  /**
   * Generate a random Head count text.
   * @private
   * @return {string} - Label for the number of employees.
   */
  private generateHeadCountText(): string {
    const min = faker.number.int({ min: 1, max: 500 });
    const max = faker.number.int({ min, max: min + 250 });

    return `${min} à ${max} employées.`;
  }

  /**
   * Retrieve a NAF code from a predefined list.
   * @private
   * @return {string} - A random NAF code.
   */
  private getRandomNafCode(): string {
    const codes = ['2431Z', '7010Z', '8299Z', '4648Z'];

    return faker.helpers.arrayElement(codes);
  }
}
