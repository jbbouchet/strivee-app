import { registerAs } from '@nestjs/config';

export default registerAs('application', () => {
  const port = parseInt(process.env.PORT);

  return {
    port: Number.isSafeInteger(port) ? port : 3000,
    env: process.env.NODE_ENV || 'development',
  };
});
