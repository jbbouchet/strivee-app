import { BadRequestException } from '@nestjs/common';
import { Account } from '@strivee-api/security';
import { isAccount } from '@strivee-api/security/application/validator';

export async function extractAccountFromRequest(request: { ip: string; user?: any }): Promise<Account> {
  if (!request.user) {
    (request.user as Account) = {
      provider: 'security',
      ref: () => request.ip,
    };
  }

  if (isAccount(request.user)) {
    return request.user;
  }

  throw new BadRequestException('No suitable type for the Authentification account in request.');
}
