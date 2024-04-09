import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from '@strivee-api/company/infrastructure/company.module';
import { FranceTravailModule } from '@strivee-api/france-travail/infrastructure/france-travail.module';
import { DatabaseModule } from './common/database/infrastructure/database.module';

@Module({
  imports: [ConfigModule.forRoot({ cache: true, isGlobal: true }), DatabaseModule, FranceTravailModule, CompanyModule],
})
export class AppModule {}
