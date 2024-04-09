import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FranceTravailAggregatorConfig, FranceTravailAuthConfig } from '@strivee-api/france-travail';
  TypeormFrenchLocalityEntity,
import francetravailConfig from './config';
import { TypeormFrenchLocalityEntity, TypeormJobEntity } from './datastore/typeorm';
import { createFranceTravailAggregatorSourceConfig, createFranceTravailAuthConfig } from './factory';
import { FranceTravailAuthenticator } from './security';

@Module({
  imports: [ConfigModule.forFeature(francetravailConfig), TypeOrmModule.forFeature([TypeormJobEntity, TypeormFrenchLocalityEntity]), HttpModule],
  providers: [
    FranceTravailAuthenticator,
    {
      provide: FranceTravailAuthConfig,
      useFactory: (s: ConfigService) => createFranceTravailAuthConfig(s),
      inject: [ConfigService],
    },
    {
      provide: FranceTravailAggregatorConfig,
      useFactory: (s: ConfigService) => createFranceTravailAggregatorSourceConfig(s),
      inject: [ConfigService],
    },
  ],
})
export class FranceTravailModule {}
