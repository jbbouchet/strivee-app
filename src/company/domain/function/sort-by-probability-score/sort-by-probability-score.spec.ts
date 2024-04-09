import { RecruitingCompany } from '@strivee-api/company';
import { sortByHigherProbabilityScore, sortByLowerProbabilityScore } from './sort-by-probability-score';

describe('@Domain/Company/sortByProbabilityScore', () => {
  describe('# sortByLowerProbabilityScore() function', () => {
    it('should sort array from lower to higher probabilityScore', () => {
      const companies = [
        { probabilityScore: 50 },
        { probabilityScore: 20 },
        { probabilityScore: 80 },
        { probabilityScore: 30 },
      ] as RecruitingCompany[];
      const sorted = sortByLowerProbabilityScore(companies);

      const scores = sorted.map((obj) => obj.probabilityScore);
      expect(scores).toEqual([20, 30, 50, 80]);
    });

    it('should handle an empty array', () => {
      expect(sortByLowerProbabilityScore([])).toEqual([]);
    });
  });

  describe('# sortByHigherProbabilityScore() function', () => {
    it('should sort array from higher to lower probabilityScore', () => {
      const objects = [
        { probabilityScore: 50 },
        { probabilityScore: 20 },
        { probabilityScore: 80 },
        { probabilityScore: 30 },
      ] as RecruitingCompany[];

      const sorted = sortByHigherProbabilityScore(objects);

      const scores = sorted.map((obj) => obj.probabilityScore);
      expect(scores).toEqual([80, 50, 30, 20]);
    });

    it('should handle an empty array', () => {
      expect(sortByHigherProbabilityScore([])).toEqual([]);
    });
  });
});
