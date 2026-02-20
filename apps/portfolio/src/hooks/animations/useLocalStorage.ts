/**
 * useLocalStorage Hook
 * Generic hook for localStorage state management
 */

import { useState, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (_value: T | ((_prev: T) => T)) => void, boolean] {
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState<T>(defaultValue);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);

    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        setValue(JSON.parse(saved));
      }
    } catch (error) {
      console.error(`Failed to load ${key} from localStorage:`, error);
    }
  }, [key]);

  // Save to localStorage whenever value changes
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Failed to save ${key} to localStorage:`, error);
      }
    }
  }, [key, value, mounted]);

  return [value, setValue, mounted];
}
