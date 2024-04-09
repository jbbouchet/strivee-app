import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  TypeormFrenchLocalityEntity,
  TypeormJobEntity,
} from '@strivee-api/france-travail/infrastructure/datastore/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TypeormJobEntity, TypeormFrenchLocalityEntity])],
})
export class FranceTravailModule {}
