import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { RecruitingCompany } from '@strivee-api/company';
import { RecruitingCompanyAggregator } from '@strivee-api/company/infrastructure/aggregator';
import { RecruitingCompanySearchOptionsDto } from '@strivee-api/company/infrastructure/dto';
import { NoValidAggregationSourceResultError } from '@strivee-api/core';
import { Account, TokenRateLimiter } from '@strivee-api/security';
import { RequestAccount } from '@strivee-api/security/infrastructure/decorator';
import { TokenRateLimitGuard } from '@strivee-api/security/infrastructure/guard';

@Controller('company')
export class CompanyController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly aggregator: RecruitingCompanyAggregator,
    private readonly limiter: TokenRateLimiter,
  ) {}

  @Get()
  @UseGuards(TokenRateLimitGuard)
  public async list(@RequestAccount() account: Account, @Query() options: RecruitingCompanySearchOptionsDto) {
    let companies: RecruitingCompany[] = [];
    let availableToken = await this.limiter.getAvailableTokenCount(account);

    try {
      const aggregate = await this.aggregator.createAggregate(options);
      companies = aggregate.entities();
      availableToken = await this.limiter.decreaseTokenCount(account);
    } catch (e) {
      if (e instanceof NoValidAggregationSourceResultError) {
        this.logger.error(e.message);
      } else {
        throw e;
      }
    }

    return { availableToken, companies };
  }
}
