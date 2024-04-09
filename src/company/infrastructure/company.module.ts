import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { RecruitingCompanyAggregator } from './aggregator';
import { CompanyController } from './controller';
import { AggregatorSourcesLoader } from './service';

@Module({
  imports: [DiscoveryModule],
  controllers: [CompanyController],
  providers: [RecruitingCompanyAggregator, AggregatorSourcesLoader],
})
export class CompanyModule {}
