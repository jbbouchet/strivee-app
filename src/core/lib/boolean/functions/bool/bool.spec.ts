import { bool } from './bool';

describe('bool() function', () => {

  it('returns true for truthy values', () => {
    expect(bool('y')).toBe(true);
    expect(bool('yes')).toBe(true);
    expect(bool('true')).toBe(true);
    expect(bool('1')).toBe(true);
    expect(bool('on')).toBe(true);
    expect(bool('YES')).toBe(true);
    expect(bool('True')).toBe(true);
    expect(bool('ON')).toBe(true);
    expect(bool('TrUe')).toBe(true);
    expect(bool('YeS')).toBe(true);
    expect(bool('On')).toBe(true);
    expect(bool(1)).toBe(true);
    expect(bool(true)).toBe(true);
  });

  it('returns false for falsy values', () => {
    expect(bool('n')).toBe(false);
    expect(bool('no')).toBe(false);
    expect(bool('false')).toBe(false);
    expect(bool('0')).toBe(false);
    expect(bool('off')).toBe(false);
    expect(bool('NO')).toBe(false);
    expect(bool('False')).toBe(false);
    expect(bool('OFF')).toBe(false);
    expect(bool('FaLsE')).toBe(false);
    expect(bool('No')).toBe(false);
    expect(bool(0)).toBe(false);
    expect(bool(false)).toBe(false);
  });

  it('returns undefined for other values', () => {
    expect(bool('foo')).toBeUndefined();
    expect(bool('')).toBeUndefined();
    expect(bool(null)).toBeUndefined();
    expect(bool(undefined)).toBeUndefined();
    expect(bool({})).toBeUndefined();
  });
});