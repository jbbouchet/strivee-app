import { RecruitingCompany } from '@strivee-api/company';


/**
 * Sorts a copy array of RecruitingCompany in ascending order from lower to higher scores
 * according to the `probabilityScore` property.
 *
 * @param companies - The array to sort.
 * @return {Array<RecruitingCompany>} - A copy of the array sorted by `probabilityScore`.
 */
export function sortByLowerProbabilityScore(companies: RecruitingCompany[]) {
  return [...companies].sort((a, b) => a.probabilityScore - b.probabilityScore);
}

/**
 * Sorts a copy array of RecruitingCompany in ascending order from higher to lower scores
 * according to the `probabilityScore` property.
 *
 * @param companies - The array to sort.
 * @return  {Array<RecruitingCompany>} - A copy of the array sorted by `probabilityScore`.
 */
export function sortByHigherProbabilityScore(companies: RecruitingCompany[]) {
  return companies.sort((a, b) => b.probabilityScore - a.probabilityScore);
}
