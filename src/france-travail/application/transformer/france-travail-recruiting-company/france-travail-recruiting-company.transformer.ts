import { RecruitingCompany } from '@strivee-api/company';
import { FranceTravailRecruitingCompany } from '@strivee-api/france-travail';


/**
 * Transforms FranceTravailRecruitingCompany.
 */
export class FranceTravailRecruitingCompanyTransformer {
  /**
   * Transforms `FranceTravailRecruitingCompany` into `RecruitingCompany`.
   * @param company - The company to transform.
   */
  public toRecruitingCompany(company: FranceTravailRecruitingCompany): RecruitingCompany {
    return {
      address: {
        full: company.address,
        locality: company.city,
        lat: company.lat,
        lng: company.lon,
      },
      alternance: company.alternance,
      contactMode: company.contact_mode,
      distance: company.distance,
      headcountText: company.headcount_text,
      naf: company.naf,
      name: company.name,
      siret: company.siret,
      probabilityScore: company.stars * 20,
      probabilityJobs: [
        {
          category: company.matched_rome_label,
        },
      ],
    };
  }
}
