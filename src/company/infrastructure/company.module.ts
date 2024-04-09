import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { RecruitingCompanyAggregator } from './aggregator';
import { AggregatorSourcesLoader } from './service';

@Module({
  imports: [DiscoveryModule],
  providers: [RecruitingCompanyAggregator, AggregatorSourcesLoader],
})
export class CompanyModule {}
