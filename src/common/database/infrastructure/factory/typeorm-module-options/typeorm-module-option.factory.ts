import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function typeormModuleOptionsFactory(service: ConfigService): TypeOrmModuleOptions {
  const host = service.getOrThrow('database.host');
  const synchronize = service.get('database.autoMigrate') ?? false;

  const logger = new Logger('Application/Database');
  logger.log(`Connect application to database "${host}". Auto-sync is ${synchronize ? 'enabled' : 'disabled'}`);

  return {
    type: 'postgres',
    host,
    port: service.getOrThrow('database.port'),
    username: service.getOrThrow('database.user'),
    password: service.getOrThrow('database.password'),
    database: service.getOrThrow('database.name'),
    autoLoadEntities: true,
    synchronize,
  };
}
