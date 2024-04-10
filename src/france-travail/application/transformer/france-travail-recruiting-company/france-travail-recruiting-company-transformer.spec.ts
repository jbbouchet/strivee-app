import { FranceTravailRecruitingCompany } from '@strivee-api/france-travail';
import { FranceTravailRecruitingCompanyTransformer } from './france-travail-recruiting-company.transformer';

describe('@Application/FranceTravail/FranceTravailRecruitingCompanyTransformer', () => {
  let transformer: FranceTravailRecruitingCompanyTransformer;

  beforeEach(() => {
    transformer = new FranceTravailRecruitingCompanyTransformer();
  });

  it('should be defined', () => {
    expect(transformer).toBeDefined();
  });

  it('should transform FranceTravailRecruitingCompany to RecruitingCompany', () => {
    const mockFranceTravailCompany: FranceTravailRecruitingCompany = {
      address: '1 rue de la liberté',
      city: 'Dijon',
      lat: 45.0,
      lon: 1.0,
      alternance: true,
      contact_mode: 'Par e-mail uniquement',
      distance: 10,
      headcount_text: '11 à 50 employées',
      naf: '6202A',
      naf_text: 'Code NAF',
      name: 'Entreprise de test',
      siret: '12345678901234',
      stars: 4,
      matched_rome_code: 'M1221',
      social_network: '',
      matched_rome_label: 'Software Development',
      matched_rome_slug: 'ingenieur-informatique',
      url: '',
      website: 'https://example.com',
    };

    expect(transformer.toRecruitingCompany(mockFranceTravailCompany)).toEqual({
      address: {
        full: mockFranceTravailCompany.address,
        locality: mockFranceTravailCompany.city,
        lat: mockFranceTravailCompany.lat,
        lng: mockFranceTravailCompany.lon,
      },
      alternance: mockFranceTravailCompany.alternance,
      contactMode: mockFranceTravailCompany.contact_mode,
      distance: mockFranceTravailCompany.distance,
      headcountText: mockFranceTravailCompany.headcount_text,
      naf: mockFranceTravailCompany.naf,
      name: mockFranceTravailCompany.name,
      siret: mockFranceTravailCompany.siret,
      probabilityScore: 80, // stars * 20
      probabilityJobs: [
        {
          category: mockFranceTravailCompany.matched_rome_label,
        },
      ],
    });
  });
});
