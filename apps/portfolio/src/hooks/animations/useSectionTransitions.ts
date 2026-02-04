/**
 * useSectionTransitions Hook
 * Manages GSAP transitions between sections
 */

import { useEffect } from 'react';
import { gsap } from 'gsap';
import type { SectionRef } from './useSectionRefs';

export function useSectionTransitions(
  currentSection: number,
  refs: SectionRef[]
): void {
  useEffect(() => {

    if (!refs || !refs.length || refs.length < 1) return;

    const sections = refs.map((ref) => ref.current);

    sections.forEach((section, index) => {
      if (index === currentSection) {
        // Show current section
        gsap.to(section, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out"
        });
      } else {
        // Hide other sections
        const direction = index < currentSection ? -150 : 150;
        gsap.to(section, {
          opacity: 0,
          y: direction,
          scale: 0.95,
          duration: 1,
          ease: "power3.out"
        });
      }
    });
  }, [currentSection, refs]);
}
