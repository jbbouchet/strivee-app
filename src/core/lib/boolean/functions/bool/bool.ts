/**
 * Evaluates a value and returns a boolean representation.
 *
 * @param {any} value - The value to be evaluated.
 * @return {boolean | undefined } - Returns true if the value is "y", "yes", "true", "1", or "on" and
 * false if the value is "n", "no", "false", "0" or "off". Returns are `undefined` otherwise;
 */
export function bool(value: any): boolean | undefined {

  if (/^(?:y|yes|true|1|on)$/i.test(value)) {
    return true;
  }

  if (/^(?:n|no|false|0|off)$/i.test(value)) {
    return false;
  }

  return undefined;

}