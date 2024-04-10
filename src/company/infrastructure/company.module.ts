import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { SecurityModule } from '@strivee-api/security/infrastructure/security.module';
import { RecruitingCompanyAggregator } from './aggregator';
import { CompanyController } from './controller';
import { AggregatorSourcesLoader } from './service';

@Module({
  imports: [DiscoveryModule, SecurityModule],
  controllers: [CompanyController],
  providers: [RecruitingCompanyAggregator, AggregatorSourcesLoader],
})
export class CompanyModule {}
