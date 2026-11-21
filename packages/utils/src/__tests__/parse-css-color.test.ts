import { describe, expect, it } from 'vitest';
import { parseCssColor } from '../color';

describe('parseCssColor', () => {
  it('reads #rrggbb', () => {
    expect(parseCssColor('#32a0c5')).toBe(0x32a0c5);
  });

  it('reads rgb()', () => {
    expect(parseCssColor('rgb(50, 160, 197)')).toBe(0x32a0c5);
  });

  it('returns null for something that is not a colour', () => {
    expect(parseCssColor('nope')).toBeNull();
  });

  it('reads #rgb and tolerates case and whitespace', () => {
    expect(parseCssColor('  #FA0 ')).toBe(0xffaa00);
  });

  it('reads space-separated rgb() with alpha', () => {
    expect(parseCssColor('rgb(50 160 197 / 0.5)')).toBe(0x32a0c5);
  });

  it('rejects out-of-range channels', () => {
    expect(parseCssColor('rgb(300, 0, 0)')).toBeNull();
  });
});
