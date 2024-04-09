import { registerAs } from '@nestjs/config';

export default registerAs('francetravail', () => {
  const rateLimit = parseInt(process.env.FRANCE_TRAVAIL_LABONNEBOITE_RATE_LIMIT);
  const labonneboite = {
    rateLimit: Number.isFinite(rateLimit) ? rateLimit : undefined,
  };

  return {
    clientId: process.env.FRANCE_TRAVAIL_CLIENT_ID || '',
    clientSecret: process.env.FRANCE_TRAVAIL_CLIENT_SECRET || '',
    labonneboite,
  };
});
