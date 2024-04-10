import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags, ApiTooManyRequestsResponse } from '@nestjs/swagger';
import { RecruitingCompanyAggregator } from '@strivee-api/company/infrastructure/aggregator';
import { RecruitingCompanySearchOptionsDto } from '@strivee-api/company/infrastructure/dto';
import { CompanyListResponse } from '@strivee-api/company/infrastructure/entities/company-list-response';
import { NoValidAggregationSourceResultError } from '@strivee-api/core';
import { Account, TokenRateLimiter } from '@strivee-api/security';
import { RequestAccount } from '@strivee-api/security/infrastructure/decorator';
import { TokenRateLimitGuard } from '@strivee-api/security/infrastructure/guard';

@ApiTags('Company')
@Controller('company')
export class CompanyController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly aggregator: RecruitingCompanyAggregator,
    private readonly limiter: TokenRateLimiter,
  ) {}

  @Get()
  @UseGuards(TokenRateLimitGuard)
  @ApiOkResponse({ description: 'The list of companies likely to recruit and the remaining number of call tokens.', type: CompanyListResponse })
  @ApiBadRequestResponse({ description: 'One or more parameters of the request are not valid.' })
  @ApiTooManyRequestsResponse({ description: 'All tokens available for this account have been used.' })
  public async list(@RequestAccount() account: Account, @Query() options: RecruitingCompanySearchOptionsDto): Promise<CompanyListResponse> {
    const response = new CompanyListResponse();
    response.availableToken = await this.limiter.getAvailableTokenCount(account);

    try {
      const aggregate = await this.aggregator.createAggregate(options);
      response.success = true;
      response.companies = aggregate.entities();
      response.availableToken = await this.limiter.decreaseTokenCount(account);
    } catch (e) {
      if (e instanceof NoValidAggregationSourceResultError) {
        this.logger.error(e.message);
        response.success = false;
        response.message = 'No source has produced a relevant result for this request. Modify the parameters and try again.';
      } else {
        throw e;
      }
    }

    return response;
  }
}
