import { Account } from '@strivee-api/security';
import { isAccount } from './is-account.validator';

describe('@Application/Security/isAccount()', () => {
  it('should return true for a valid Account', () => {
    const token: Account = {
      provider: 'provider',
      ref: () => 'reference',
    };

    expect(isAccount(token)).toBe(true);
  });

  it('should return false for a missing provider', () => {
    const token: Omit<Account, 'provider'> = {
      ref: () => 'reference',
    };

    expect(isAccount(token)).toBe(false);
  });

  it('should return false for an invalid provider type', () => {
    const token: Account = {
      provider: 123 as unknown as string,
      ref: () => 'reference',
    };

    expect(isAccount(token)).toBe(false);
  });

  it('should return false for a missing ref', () => {
    const token: Omit<Account, 'ref'> = {
      provider: 'provider',
    };

    expect(isAccount(token)).toBe(false);
  });

  it('should return false for an invalid ref type', () => {
    const token = {
      provider: 'provider',
      ref: 'invalid', // Invalid type
    };

    expect(isAccount(token)).toBe(false);
  });
});
