import { registerAs } from '@nestjs/config';
import { bool } from '@strivee-api/core/lib';

export default registerAs('database', () => ({
  host: process.env.POSTGRESQL_DATABASE_HOST || 'localhost',
  name: process.env.POSTGRESQL_DATABASE_NAME || 'strivee',
  user: process.env.POSTGRESQL_DATABASE_USER || 'strivee',
  password: process.env.POSTGRESQL_DATABASE_PASSWORD || 'secure-password',
  port: process.env.POSTGRESQL_DATABASE_PORT ? Number.parseInt(process.env.POSTGRESQL_DATABASE_PORT) : 5432,
  autoMigrate: bool(process.env.POSTGRESQL_DATABASE_AUTO_MIGRATION) ?? false,
}));
