import { Account } from '@strivee-api/security';


/**
 * Checks if the provided object is a valid Account.
 *
 * @param account - The object to be validated.
 * @return {boolean} - Returns true if the provided object is a valid Account, otherwise returns false.
 */
export function isAccount(account: any): account is Account {
  return (
    typeof account === 'object' &&
    account !== null &&
    typeof (account as Account).provider === 'string' &&
    account.provider !== '' &&
    typeof (account as Account).ref === 'function' &&
    ['string', 'number'].includes(typeof account.ref())
  );
}
