import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from '@strivee-api/company/infrastructure/company.module';
import { FranceTravailModule } from '@strivee-api/france-travail/infrastructure/france-travail.module';
import { SecurityModule } from '@strivee-api/security/infrastructure/security.module';
import applicationConfig from './app.config';
import { DatabaseModule } from './common/database/infrastructure/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [applicationConfig],
      cache: true,
      isGlobal: true,
    }),
    DatabaseModule,
    SecurityModule,
    FranceTravailModule,
    CompanyModule,
  ],
})
export class AppModule {}
