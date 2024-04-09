import { AGGREGATION_STATE } from '../../state';
import { isAggregationState } from './is-aggregation-state.validator';

describe('@Application/Company/isAggregationState', () => {
  it('should return true for a valid aggregation state', () => {
    expect(isAggregationState(AGGREGATION_STATE.VALID)).toBe(true);
    expect(isAggregationState(AGGREGATION_STATE.INVALID)).toBe(true);
  });

  it('should return false for values that are not valid aggregation states', () => {
    expect(isAggregationState('not-a-valid-state')).toBe(false);
    expect(isAggregationState(null)).toBe(false);
    expect(isAggregationState(undefined)).toBe(false);
    expect(isAggregationState(123)).toBe(false);
    expect(isAggregationState({})).toBe(false);
    expect(isAggregationState([])).toBe(false);
  });
});
