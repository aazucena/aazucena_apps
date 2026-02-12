import { useState, useEffect, useCallback } from 'react';

/**
 * useScrollToTop Hook
 * Manages visibility state for "Back to Top" buttons based on scroll threshold.
 */
export function useScrollToTop(threshold: number = 300) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (window.scrollY > threshold) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [threshold]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [toggleVisibility]);

  return { isVisible };
}
