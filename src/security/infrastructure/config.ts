import { registerAs } from '@nestjs/config';

export default registerAs('security', () => {
  let defaultTokenCount = parseInt(process.env.TOKEN_RATE_LIMIT_DEFAULT_COUNT);

  if (!Number.isFinite(defaultTokenCount)) {
    defaultTokenCount = 500;
  }

  return {
    defaultTokenCount,
  };
});
