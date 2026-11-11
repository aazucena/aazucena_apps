import { describe, expect, it } from 'vitest';
import { getErrorMessage } from '../errors';

describe('getErrorMessage', () => {
  it('reads the message from a Standard Schema issue (what TanStack Form stores)', () => {
    expect(getErrorMessage({ message: 'Invalid email address', path: ['email'] })).toBe(
      'Invalid email address',
    );
  });

  it('passes a plain string through', () => {
    expect(getErrorMessage('Required')).toBe('Required');
  });

  it('returns an empty string when there is no error', () => {
    expect(getErrorMessage(undefined)).toBe('');
  });
});
