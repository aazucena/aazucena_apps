import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '@aazucena/constants';

/**
 * useTheme Hook
 * Manages light/dark mode with side effects (localStorage, document classes).
 * Decouples logic from UI components.
 */
export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // 1. Initial hydration — priority: saved pref → system pref → fallback dark
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark' | null;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = saved ?? (systemDark ? 'dark' : 'light');

    setTheme(resolved);
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }, []);

  // 2. Keep in sync when system preference changes (user changes OS setting)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved) return; // user has an explicit preference — don't override it

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const next = e.matches ? 'dark' : 'light';
      setTheme(next);
      document.documentElement.classList.toggle('dark', e.matches);
    };

    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  // 2. Toggle function
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    if (typeof window !== 'undefined') {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem(STORAGE_KEYS.THEME, 'light');
      }
    }
  }, [theme]);

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
}
