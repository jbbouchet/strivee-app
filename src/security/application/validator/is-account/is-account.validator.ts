import { Account } from '@strivee-api/security';

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
