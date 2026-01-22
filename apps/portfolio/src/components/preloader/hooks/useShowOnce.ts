import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'portfolio-preloader-seen';

/**
 * Hook to manage "show once per session" behavior using sessionStorage
 *
 * @param enabled - Whether to enable the show-once behavior
 * @returns Object with hasSeenBefore flag and markAsSeen function
 */
export function useShowOnce(enabled: boolean = false) {
  const [hasSeenBefore, setHasSeenBefore] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setIsChecking(false);
      return;
    }

    // Check if user has already seen the preloader in this session
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      const seen = sessionStorage.getItem(STORAGE_KEY);
      setHasSeenBefore(seen === 'true');
    }

    setIsChecking(false);
  }, [enabled]);

  const markAsSeen = useCallback(() => {
    if (!enabled) return;

    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      try {
        sessionStorage.setItem(STORAGE_KEY, 'true');
        setHasSeenBefore(true);
      } catch (error) {
        // SessionStorage might be disabled or full
        console.warn('[Preloader] Failed to set sessionStorage:', error);
      }
    }
  }, [enabled]);

  const resetSeen = useCallback(() => {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
        setHasSeenBefore(false);
      } catch (error) {
        console.warn('[Preloader] Failed to clear sessionStorage:', error);
      }
    }
  }, []);

  return {
    hasSeenBefore,
    markAsSeen,
    resetSeen,
    isChecking,
  };
}
