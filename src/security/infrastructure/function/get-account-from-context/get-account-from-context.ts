import { ExecutionContext } from '@nestjs/common';
import { Account } from '@strivee-api/security';
import { Request } from 'express';
import { extractAccountFromRequest } from '../extract-account-from-request/extract-account-from-request';

export async function getAccountFromContext(ctx: ExecutionContext): Promise<Account> {
  const request: Request = ctx.switchToHttp().getRequest();
  return extractAccountFromRequest(request);
}
