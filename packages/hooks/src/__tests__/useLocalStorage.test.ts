import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../state/useLocalStorage';

beforeEach(() => {
  localStorage.clear();
});

describe('useLocalStorage', () => {
  it('returns the default value when key is not set', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('persists a value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', ''));

    act(() => {
      result.current[1]('saved');
    });

    expect(localStorage.getItem('test-key')).toBe('"saved"');
  });

  it('reads an existing value from localStorage on mount', () => {
    localStorage.setItem('test-key', JSON.stringify('pre-existing'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    // After mount effect fires, value should be the stored one
    expect(result.current[0]).toBe('pre-existing');
  });

  it('supports functional updater', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });
});
