import { AGGREGATION_STATE } from '../../state';


/**
 * Checks if the given state is a valid value for aggregation state.
 *
 * @param {any} state - The state to check.
 * @return {boolean} - True if the state is an aggregation state, false otherwise.
 */
export function isAggregationState(state: any): state is AGGREGATION_STATE {
  return state === AGGREGATION_STATE.VALID || state === AGGREGATION_STATE.INVALID;
}
