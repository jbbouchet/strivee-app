import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormModuleOptionsFactory } from '@strivee-api/common/database/infrastructure/factory';
import databaseConfig from './config';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    TypeOrmModule.forRootAsync({
      useFactory: (service: ConfigService) => typeormModuleOptionsFactory(service),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
