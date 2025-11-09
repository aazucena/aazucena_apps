/**
 * useSectionTransitions Hook
 * Manages GSAP transitions between sections
 */

import { useEffect } from 'react';
import { gsap } from 'gsap';
import type { SectionRefs } from './useSectionRefs';

export function useSectionTransitions(
  currentSection: number,
  refs: SectionRefs
): void {
  useEffect(() => {
    const {
      heroContentRef,
      aboutContentRef,
      projectsContentRef,
      experienceContentRef,
      skillsContentRef,
      testimonialsContentRef,
      blogContentRef,
      awardsContentRef
    } = refs;

    if (!heroContentRef.current || !aboutContentRef.current || !projectsContentRef.current ||
        !experienceContentRef.current || !skillsContentRef.current || !testimonialsContentRef.current ||
        !blogContentRef.current || !awardsContentRef.current) return;

    const sections = [
      heroContentRef.current,
      aboutContentRef.current,
      projectsContentRef.current,
      experienceContentRef.current,
      skillsContentRef.current,
      testimonialsContentRef.current,
      blogContentRef.current,
      awardsContentRef.current
    ];

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
