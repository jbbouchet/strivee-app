import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { RecruitingCompanyAggregator } from '@strivee-api/company/infrastructure/aggregator';
import { RECRUITING_AGGREGATOR_SOURCE_METADATA } from '@strivee-api/company/infrastructure/decorator';

@Injectable()
export class AggregatorSourcesLoader implements OnApplicationBootstrap {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly aggregator: RecruitingCompanyAggregator,
    private readonly reflector: Reflector,
  ) {}

  /**
   *  Retrieves and adds the sources to the aggregator from the application's providers.
   */
  public onApplicationBootstrap(): any {
    this.listSources().forEach((source) => this.aggregator.addSource(source));
  }

  /**
   * Filters the list of providers and returns instances decorated with
   * the RECRUITING_AGGREGATOR_SOURCE_METADATA metadata.
   * @private
   */
  private listSources(): any[] {
    return this.discoveryService
      .getProviders()
      .filter((wrapper) => this.isASourceProvider(wrapper))
      .map((wrapper) => wrapper.instance);
  }

  /**
   * Ensures that the wrapper contains an instance decorated with
   * the RECRUITING_AGGREGATOR_SOURCE_METADATA metadata.
   * @param wrapper
   * @private
   */
  private isASourceProvider(wrapper: InstanceWrapper): boolean {
    return (
      wrapper.instance &&
      !wrapper.isAlias &&
      this.reflector.get(RECRUITING_AGGREGATOR_SOURCE_METADATA, wrapper.instance.constructor)
    );
  }
}
