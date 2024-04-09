import { FranceTravailRecruitingCompany } from '@strivee-api/france-travail';

export interface FranceTravailSearchParams {
  commune_id: string;

  rome_codes: string;
}

export interface FranceTravailSearchResponse {
  companies: FranceTravailRecruitingCompany[];
}
