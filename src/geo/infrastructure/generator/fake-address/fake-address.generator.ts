import { Generator } from '@strivee-api/core';
import { Address } from '@strivee-api/geo';
import { faker } from '@faker-js/faker/locale/fr';

/**
 * Use this class to generate `Address` using the Fakejs lib.
 * Only use this class in development environment.
 */
export class FakeAddressGenerator implements Generator<Address> {
  /**
   * @inheritDoc
   */
  public generate(): Address {
    const [lat, lng] = faker.location.nearbyGPSCoordinate();
    const locality = faker.location.city();

    return {
      full: `${faker.location.streetAddress()}, ${faker.location.zipCode('#####')} ${locality}`,
      locality,
      lat,
      lng,
    };
  }

  /**
   * @inheritDoc
   */
  public feed(count: number): Array<Address> {
    return Array.from({ length: count }, () => this.generate());
  }
}
