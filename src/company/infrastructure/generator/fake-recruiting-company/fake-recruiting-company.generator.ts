import { faker } from '@faker-js/faker/locale/fr';
import { Company, RecruitingCompany } from '@strivee-api/company';
import { FakeCompanyGenerator } from '@strivee-api/company/infrastructure/generator';
import { Generator } from '@strivee-api/core';


/**
 * Use this class to generate `RecruitingCompany` using the Fakejs lib.
 * Only use this class in development environment.
 */
export class FakeRecruitingCompanyGenerator implements Generator<RecruitingCompany> {
  /**
   * Generator used to generate the basics information about a company.
   * @private
   */
  private readonly companyGenerator: Generator<Company>;

  constructor(companyGenerator?: Generator<Company>) {
    this.companyGenerator = companyGenerator ?? new FakeCompanyGenerator();
  }

  /**
   * @inheritDoc
   */
  public generate(): RecruitingCompany {
    const company = this.companyGenerator.generate();

    return {
      ...company,
      probabilityScore: faker.number.float({ min: 0, max: 100, fractionDigits: 0.01 }),
      contactMode: this.getContactMode(),
      alternance: faker.datatype.boolean(),
      distance: faker.datatype.boolean() ? faker.number.float({ min: 0, max: 50 }) : undefined,
    };
  }

  /**
   * @inheritDoc
   */
  public feed(count: number): Array<RecruitingCompany> {
    return Array.from({ length: count }, () => this.generate());
  }

  /**
   * Retrieve a random mode from a predefined list.
   * @private
   * @return {string} - A random contact mode.
   */
  private getContactMode() {
    const modes = ['Se présenter spontanément', 'Envoyer un CV et une lettre de motivation', 'Contacter par téléphone'];
    return faker.helpers.arrayElement(modes);
  }
}
