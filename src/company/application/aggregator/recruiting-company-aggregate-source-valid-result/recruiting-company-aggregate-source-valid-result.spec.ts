import { RecruitingCompany } from '@strivee-api/company';
import { AGGREGATION_STATE } from '@strivee-api/core';
import { RecruitingCompanyAggregateSourceValidResult } from './recruiting-company-aggregate-source-valid-result';

describe('@Application/Company/RecruitingCompanyAggregateSourceValidResult', () => {
  const PROVIDER = Symbol('test');

  let result: RecruitingCompanyAggregateSourceValidResult;

  beforeEach(() => {
    result = new RecruitingCompanyAggregateSourceValidResult(PROVIDER);
  });

  it('should return the provider', () => {
    expect(result.provider).toBe(PROVIDER);
  });

  it('should confirm the aggregation state is VALID', () => {
    expect(result.state).toBe(AGGREGATION_STATE.VALID);
  });

  it('should initialize with default values if no companies are provided', () => {
    expect(result.entities()).toEqual([]);
    expect(result.count()).toBe(0);
  });

  it('should initialize with provided companies', () => {
    let companies = Array.from({ length: 42 }, (_, index) => ({ name: index }) as unknown as RecruitingCompany);

    const result = new RecruitingCompanyAggregateSourceValidResult('testProvider', companies);
    expect(result.entities()).toEqual(companies);
    expect(result.count()).toBe(companies.length);
  });

  it('should allow updating the stored companies', () => {
    let companies = Array.from({ length: 42 }, (_, index) => ({ name: index }) as unknown as RecruitingCompany);
    const result = new RecruitingCompanyAggregateSourceValidResult('testProvider', companies);

    const newCompanies: RecruitingCompany[] = Array.from({ length: 10 }, (_, index) => ({ name: index }) as unknown as RecruitingCompany);

    result.setCompanies(newCompanies);
    expect(result.entities()).toEqual(newCompanies);
    expect(result.count()).toBe(newCompanies.length);
  });
});
