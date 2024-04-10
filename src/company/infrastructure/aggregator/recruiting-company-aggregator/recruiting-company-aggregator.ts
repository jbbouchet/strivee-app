import { Logger } from '@nestjs/common';
import { RecruitingCompany, RecruitingSearchOptions, sortByHigherProbabilityScore } from '@strivee-api/company';
import {
  Aggregate,
  AggregateSourceValidResult,
  Aggregator,
  AggregatorSource,
  isAnAggregateSourceInvalidResult,
  isAnAggregateSourceValidResult,
  NoAggregationReadySourceError,
  NoValidAggregationSourceResultError,
} from '@strivee-api/core';

export class RecruitingCompanyAggregator implements Aggregator<RecruitingCompany, RecruitingSearchOptions> {
  /**
   * Aggregation sources
   * @private
   */
  private readonly sources = new Set<AggregatorSource<RecruitingCompany>>();

  /**
   * Instance logger
   * @private
   */
  private readonly logger = new Logger(this.constructor.name);

  /**
   * Adds a source to the aggregator.
   *
   * @param {AggregatorSource<RecruitingCompany>} source - The source to be added.
   * @returns {this} The aggregator.
   */
  public addSource(source: AggregatorSource<RecruitingCompany>): this {
    this.sources.add(source);
    return this;
  }

  /**
   * @inheritDoc
   * @param options - Options used to configure the result of the aggregation.
   */
  public async createAggregate(options: RecruitingSearchOptions): Promise<Aggregate<RecruitingCompany>> {
    const sources = this.getReadySources();

    this.logger.log(`Create aggregate with ${sources.length} sources`);

    const results = await Promise.all(sources.map((source) => source.createAggregate(options)));

    const valid: Array<AggregateSourceValidResult<RecruitingCompany>> = results.filter(isAnAggregateSourceValidResult);

    results.filter(isAnAggregateSourceInvalidResult).forEach((result) => {
      this.logger.error(result.reason().message, result.reason());
    });

    if (valid.length === 0) {
      throw new NoValidAggregationSourceResultError(`No data source produced a valid result during the aggregation of Recruiting companies.`);
    }

    return this.buildAggregateFromResults(valid);
  }

  /**
   * Merge all results into a single aggregate.
   * @param results
   * @private
   */
  private buildAggregateFromResults(results: AggregateSourceValidResult<RecruitingCompany>[]): Aggregate<RecruitingCompany> {
    let entities: RecruitingCompany[] = [];
    const aggregate: Aggregate<RecruitingCompany> = {
      entities: () => entities,
      count: () => entities.length,
    };

    results.forEach((result) => {
      if (isAnAggregateSourceValidResult(result)) {
        entities = [...entities, ...result.entities()];
      }
    });

    entities = sortByHigherProbabilityScore(entities);

    return aggregate;
  }

  /**
   * Get all source with the ready state.
   * @private
   */
  private getReadySources(): Array<AggregatorSource<RecruitingCompany>> {
    const sources = Array.from(this.sources).filter((source) => source.isReady());

    if (sources.length === 0) {
      throw new NoAggregationReadySourceError('No source ready for the aggregation of Recruiting companies.');
    }

    return sources;
  }
}
