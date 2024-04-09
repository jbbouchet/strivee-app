import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { getColumnNamesAccessorFromEntityMetadata } from '@strivee-api/common/database/infrastructure/function/get-column-name/get-column-name';
import { RecruitingCompany, RecruitingCompanyAggregateSourceValidResult, RecruitingSearchOptions } from '@strivee-api/company';
import { RecruitingAggregatorSource } from '@strivee-api/company/infrastructure/decorator';
import { AggregateSourceInValidResult, AggregateSourceValidResult, AggregatorSource } from '@strivee-api/core';
import { AGGREGATION_STATE } from '@strivee-api/core/aggregator/state';
import {
  FranceTravailAggregatorConfig,
  FranceTravailRecruitingCompany,
  FranceTravailRecruitingTransformer,
  FrenchLocality,
  Job,
} from '@strivee-api/france-travail';
import { TooMayLocalityError } from '@strivee-api/france-travail/application/error';
import { NoLocalityFoundError } from '@strivee-api/france-travail/application/error/no-locality-found.error';
import { FranceTravailSearchParams, FranceTravailSearchResponse } from '@strivee-api/france-travail/infrastructure/contract';
import { TypeormFrenchLocalityEntity, TypeormJobEntity } from '@strivee-api/france-travail/infrastructure/datastore/typeorm';
import { FranceTravailAuthenticator } from '@strivee-api/france-travail/infrastructure/security/france-travail.authenticator';
import { AxiosError, AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios';
import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';
import { Repository } from 'typeorm';

@RecruitingAggregatorSource()
export class FranceTravailAggregateSource implements AggregatorSource<RecruitingCompany, RecruitingSearchOptions> {
  /**
   * Aggregate provider.
   */
  public static AGGREGATE_PROVIDER = Symbol('francetravail.io');

  /**
   * The France travail A.P.I HTTP route used to fetch recruiting companies.
   * @private
   */
  private readonly url = 'https://api.francetravail.io/partenaire/labonneboite/v1/company';

  /**
   * Number of requests executed in the latest second.
   * @private
   */
  private requestCount: number = 0;

  /**
   * Timer used to reset the request count.
   * @private
   */
  private requestCountTimer: number | undefined;

  constructor(
    @InjectRepository(TypeormFrenchLocalityEntity) private readonly localityRepository: Repository<TypeormFrenchLocalityEntity>,
    @InjectRepository(TypeormJobEntity) private readonly jobRepository: Repository<TypeormJobEntity>,
    private readonly config: FranceTravailAggregatorConfig,
    private readonly auth: FranceTravailAuthenticator,
    private readonly http: HttpService,
  ) {}

  /**
   * @inheritDoc
   */
  public isReady(): boolean {
    return this.requestCount < this.config.apiRateLimit;
  }

  /**
   * @inheritDoc
   */
  public async createAggregate(
    options: RecruitingSearchOptions,
  ): Promise<AggregateSourceValidResult<RecruitingCompany> | AggregateSourceInValidResult> {
    // Prepare request params
    let config: AxiosRequestConfig;

    try {
      // Create headers
      const headers = this.createHeaders();
      const token = await this.auth.getToken();
      headers.set('Authorization', token.authorization);

      config = {
        params: await this.buildParams(options),
        headers,
      };
    } catch (e: any) {
      return this.createAggregateSourceInValidResult(e);
    }

    const result = await firstValueFrom(this.requestApi(config));
    this.incrementRequestCount();
    return result;
  }

  /**
   * Based on options, create params to pass in the A.P.I. request.
   * @param options
   * @private
   */
  private async buildParams(options: RecruitingSearchOptions): Promise<FranceTravailSearchParams> {
    return {
      commune_id: await this.searchLocalityCode(options),
      rome_codes: await this.searchJobs(options).then((codes) => codes.join(',')),
    };
  }

  /**
   * Create the headers to pass in the A.P.I. request.
   * @private
   */
  private createHeaders(): AxiosHeaders {
    const headers = new AxiosHeaders();
    headers.set('Content-Type', 'application/json');
    return headers;
  }

  /**
   * Retrieves the companies from the FranceTravail A.P.I.
   * @param config - Axios configuration
   * @private
   */
  private requestApi(config: AxiosRequestConfig): Observable<AggregateSourceValidResult<RecruitingCompany> | AggregateSourceInValidResult> {
    return this.http.get<FranceTravailSearchResponse>(this.url, config).pipe(
      map((response: AxiosResponse<FranceTravailSearchResponse>) => this.createAggregateSourceValidResult(response.data)),
      catchError((error: AxiosError) => of(this.createAggregateSourceInValidResult(this.transformAxiosError(error)))),
    );
  }

  /**
   * Create a valid result based on A.P.I. response.
   * @param response - The fetched data.
   * @private
   */
  private createAggregateSourceValidResult(response: FranceTravailSearchResponse): AggregateSourceValidResult<RecruitingCompany> {
    const result = this.createEmptyAggregate();
    const companies = this.transformCompanies(response.companies);
    result.setCompanies(companies);
    return result;
  }

  /**
   * Create an invalid result based on axios error.
   * @param error - Error emitted by Axios.
   * @private
   */
  private createAggregateSourceInValidResult(error: Error): AggregateSourceInValidResult {
    return {
      provider: FranceTravailAggregateSource.AGGREGATE_PROVIDER,
      state: AGGREGATION_STATE.INVALID,
      reason: () => ({
        message: error.message as string,
        code: 0,
      }),
    };
  }

  /**
   * Create a RecruitingCompany aggregate result.
   * @private
   */
  private createEmptyAggregate(): RecruitingCompanyAggregateSourceValidResult {
    return new RecruitingCompanyAggregateSourceValidResult(FranceTravailAggregateSource.AGGREGATE_PROVIDER);
  }

  /**
   * Transforms FranceTravailRecruitingCompany into RecruitingCompany.
   * @param companies - Companies to transform.
   * @private
   */
  private transformCompanies(companies: FranceTravailRecruitingCompany[]): RecruitingCompany[] {
    const transformer = new FranceTravailRecruitingTransformer();
    return companies.map(transformer.toRecruitingCompany);
  }

  /**
   * Create Error instance based on axios error.
   * @param error
   * @private
   */
  private transformAxiosError(error: AxiosError): Error {
    return new Error(error.response.data as string);
  }

  /**
   * If A.P.I has a rate limit, increase internal limit.
   * @private
   */
  private incrementRequestCount() {
    if (this.config.apiRateLimit == undefined) {
      return;
    }

    if (this.requestCountTimer) {
      clearTimeout(this.requestCountTimer);
    }

    setTimeout(() => {
      clearTimeout(this.requestCountTimer);
      this.requestCount = 0;
    }, 1000);
  }

  private async searchJobs(option: RecruitingSearchOptions): Promise<Array<Job['code']>> {
    if (typeof option.job === 'string' && option.job !== '') {
      const alias = 'job';

      const data: Array<Pick<Job, 'code'>> = await this.jobRepository
        .createQueryBuilder(alias)
        .select('code')
        .where(`"${alias}"."label" LIKE :label`, { label: `%${option.job}%` })
        .execute();

      return data.map((row) => row.code);
    }

    return [];
  }

  private async searchLocalityCode(option: RecruitingSearchOptions): Promise<FrenchLocality['inseeCode']> {
    const { postalCode, locality } = option;

    if (!postalCode && !locality) {
      return '';
    }

    const alias = 'locality';
    const accessor = getColumnNamesAccessorFromEntityMetadata<TypeormFrenchLocalityEntity>(this.localityRepository.metadata);
    const builder = this.localityRepository.createQueryBuilder(alias).select(`"${alias}"."${accessor('inseeCode')}"`, 'inseeCode');

    if (postalCode) {
      builder.where(`"${alias}"."${accessor('postalCode')}" = :postal_code`, { postal_code: postalCode });
    }

    if (locality) {
      builder.andWhere(`"${alias}"."${accessor('name')}" LIKE :name`, { name: locality });
    }

    const result: Array<Pick<FrenchLocality, 'inseeCode'>> = await builder.execute();

    if (result.length === 1) {
      return result[0].inseeCode;
    }

    if (result.length === 0) {
      throw new NoLocalityFoundError(`No Locality found for params : postalCode: ${postalCode}, locality: ${locality}`);
    }

    throw new TooMayLocalityError(
      `Too many locality found (${result.length}) for the request. Request params : postalCode: ${postalCode}, locality: ${locality}`,
    );
  }
}
