import { Controller, Get, Logger, Query } from '@nestjs/common';
import { RecruitingCompany } from '@strivee-api/company';
import { RecruitingCompanyAggregator } from '@strivee-api/company/infrastructure/aggregator';
import { RecruitingCompanySearchOptionsDto } from '@strivee-api/company/infrastructure/dto';
import { NoValidAggregationSourceResultError } from '@strivee-api/core';

@Controller('company')
export class CompanyController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly aggregator: RecruitingCompanyAggregator) {}

  @Get()
  public async list(@Query() options: RecruitingCompanySearchOptionsDto) {
    let companies: RecruitingCompany[] = [];

    try {
      const aggregate = await this.aggregator.createAggregate(options);
      companies = aggregate.entities();
    } catch (e) {
      if (e instanceof NoValidAggregationSourceResultError) {
        this.logger.error(e.message);
      } else {
        throw e;
      }
    }

    return { companies };
  }
}
