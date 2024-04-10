import { DiscoveryService, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Test } from '@nestjs/testing';
import { RecruitingCompanyAggregator } from '@strivee-api/company/infrastructure/aggregator';
import { RecruitingAggregatorSource } from '@strivee-api/company/infrastructure/decorator';
import { AggregatorSourcesLoader } from './aggregator-sources-loader';

@RecruitingAggregatorSource()
class TestClass {}

describe('@Application/Company/AggregatorSourcesLoader', () => {
  let loader: AggregatorSourcesLoader;
  let discovery: Pick<DiscoveryService, 'getProviders'>;
  let aggregator: Pick<RecruitingCompanyAggregator, 'addSource'>;
  let instance: TestClass;
  beforeEach(async () => {
    instance = new TestClass();

    const wrapper: Partial<InstanceWrapper> = {
      isAlias: false,
      get instance() {
        return instance;
      },
    };

    discovery = {
      getProviders: jest.fn().mockReturnValue([wrapper]),
    };

    aggregator = {
      addSource: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        AggregatorSourcesLoader,
        Reflector,
        {
          provide: DiscoveryService,
          useValue: discovery,
        },
        {
          provide: RecruitingCompanyAggregator,
          useValue: aggregator,
        },
      ],
    }).compile();
    loader = module.get(AggregatorSourcesLoader);
  });

  it('should be defined', () => {
    expect(loader).toBeDefined();
  });

  it('should add all provider instances decorated with RecruitingAggregatorSource as a source in the RecruitingCompanyAggregator. ', () => {
    loader.onApplicationBootstrap();

    expect(discovery.getProviders).toHaveBeenCalled();
    expect(aggregator.addSource).toHaveBeenCalledTimes(1);
    expect(aggregator.addSource).toHaveBeenCalledWith(instance);
  });
});
