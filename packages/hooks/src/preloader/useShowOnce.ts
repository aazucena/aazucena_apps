import { useState, useCallback } from 'react';

const STORAGE_KEY = 'portfolio-preloader-seen';

/**
 * Hook to manage "show once per session" behavior using sessionStorage.
 *
 * Uses a lazy useState initializer to read sessionStorage synchronously on the
 * first render — this prevents a flash where the preloader briefly appears
 * before an async useEffect could read the "already seen" flag.
 *
 * @param enabled - Whether to enable the show-once behavior
 */
export function useShowOnce(enabled: boolean = false) {
  // Lazy initializer: runs synchronously during the first render.
  // sessionStorage is a sync API so it's safe to call here.
  const [hasSeenBefore, setHasSeenBefore] = useState(() => {
    if (!enabled) return false;
    try {
      return (
        typeof sessionStorage !== 'undefined' && sessionStorage.getItem(STORAGE_KEY) === 'true'
      );
    } catch {
      return false;
    }
  });

  const markAsSeen = useCallback(() => {
    if (!enabled) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setHasSeenBefore(true);
    } catch (error) {
      console.warn('[Preloader] Failed to set sessionStorage:', error);
    }
  }, [enabled]);

  const resetSeen = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      setHasSeenBefore(false);
    } catch (error) {
      console.warn('[Preloader] Failed to clear sessionStorage:', error);
    }
  }, []);

  return {
    hasSeenBefore,
    markAsSeen,
    resetSeen,
    isChecking: false, // Synchronous read — no async check needed
  };
}
