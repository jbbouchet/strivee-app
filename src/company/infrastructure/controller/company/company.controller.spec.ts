import { Test, TestingModule } from '@nestjs/testing';
import { RecruitingCompanyAggregator } from '@strivee-api/company/infrastructure/aggregator';
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
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
