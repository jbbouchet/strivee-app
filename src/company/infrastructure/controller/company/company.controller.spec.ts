import { Test, TestingModule } from '@nestjs/testing';
import { RecruitingCompanyAggregator } from '@strivee-api/company/infrastructure/aggregator';
import { TokenRateLimiter } from '@strivee-api/security';
import { CompanyController } from './company.controller';

describe('CompanyController', () => {
  let controller: CompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: RecruitingCompanyAggregator,
          useValue: {},
        },
        {
          provide: TokenRateLimiter,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
