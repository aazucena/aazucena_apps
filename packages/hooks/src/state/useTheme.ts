import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '@aazucena/constants';

/**
 * useTheme Hook
 * Manages light/dark mode with side effects (localStorage, document classes).
 * Decouples logic from UI components.
 */
export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // 1. Initial hydration from DOM/Storage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isDark = document.documentElement.classList.contains('dark');
    const saved = localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark' | null;

    if (saved) {
      setTheme(saved);
      if (saved === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else if (isDark) {
      setTheme('dark');
    }
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
