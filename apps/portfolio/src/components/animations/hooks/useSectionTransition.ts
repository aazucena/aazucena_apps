/**
 * useSectionTransition Hook
 * Manages section transitions with scroll handling
 */

import { useState, useEffect, useRef } from 'react';

export interface SectionTransitionOptions {
  totalSections: number;
  scrollSensitivity?: number;
  debounceTime?: number;
}

export function useSectionTransition({
  totalSections,
  scrollSensitivity = 0.002,
  debounceTime = 1000
}: SectionTransitionOptions) {
  const [currentSection, setCurrentSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrollingRef.current) return;

      const delta = e.deltaY;

      // Accumulate scroll progress
      const newProgress = Math.max(0, Math.min(0.8, scrollProgress + delta * scrollSensitivity));
      setScrollProgress(newProgress);

      // If we've scrolled enough, transition to next/previous section
      if (newProgress >= 0.7 && delta > 0 && currentSection < totalSections - 1) {
        // Scrolling down - move to next section
        isScrollingRef.current = true;
        setCurrentSection(currentSection + 1);
        setScrollProgress(0);
        setTimeout(() => {
          isScrollingRef.current = false;
        }, debounceTime);
      } else if (newProgress <= 0.1 && delta < 0 && currentSection > 0) {
        // Scrolling up - move to previous section
        isScrollingRef.current = true;
        setCurrentSection(currentSection - 1);
        setScrollProgress(0.7); // Start at high progress when going back
        setTimeout(() => {
          isScrollingRef.current = false;
        }, debounceTime);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [currentSection, scrollProgress, totalSections, scrollSensitivity, debounceTime]);

  return {
    currentSection,
    setCurrentSection,
    scrollProgress,
    setScrollProgress
  };
}
