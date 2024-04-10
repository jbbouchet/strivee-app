import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Account } from '@strivee-api/security';
import { getAccountFromContext } from '../function/get-account-from-context/get-account-from-context';


/**
 * Use the `RequestAccount` decorator to retrieve the Account executing the request.
 */
export const RequestAccount = createParamDecorator(async (data: unknown, ctx: ExecutionContext): Promise<Account> => {
  return getAccountFromContext(ctx);
});
