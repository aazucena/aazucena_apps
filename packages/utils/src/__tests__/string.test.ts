import { describe, it, expect } from 'vitest';
import { slugify, truncate } from '../string';

describe('slugify', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('strips non-word characters', () => {
    expect(slugify('Café & Bar!')).toBe('caf-bar');
  });

  it('collapses multiple hyphens', () => {
    expect(slugify('foo   ---   bar')).toBe('foo-bar');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  --hello--  ')).toBe('hello');
  });

  it('returns empty string for empty input', () => {
    expect(slugify('')).toBe('');
  });
});

describe('truncate', () => {
  it('returns the original string when shorter than limit', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('returns the original string when exactly at limit', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });

  it('truncates and appends ellipsis when over limit', () => {
    expect(truncate('hello world', 5)).toBe('hello...');
  });
});
