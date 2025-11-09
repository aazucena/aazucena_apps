/**
 * useSectionRefs Hook
 * Creates and manages refs for all section content divs
 */

import { useRef, type RefObject } from 'react';

export interface SectionRefs {
  heroRef: RefObject<HTMLElement>;
  heroContentRef: RefObject<HTMLDivElement>;
  aboutContentRef: RefObject<HTMLDivElement>;
  projectsContentRef: RefObject<HTMLDivElement>;
  experienceContentRef: RefObject<HTMLDivElement>;
  skillsContentRef: RefObject<HTMLDivElement>;
  testimonialsContentRef: RefObject<HTMLDivElement>;
  blogContentRef: RefObject<HTMLDivElement>;
  awardsContentRef: RefObject<HTMLDivElement>;
}

export function useSectionRefs(): SectionRefs {
  const heroRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const aboutContentRef = useRef<HTMLDivElement>(null);
  const projectsContentRef = useRef<HTMLDivElement>(null);
  const experienceContentRef = useRef<HTMLDivElement>(null);
  const skillsContentRef = useRef<HTMLDivElement>(null);
  const testimonialsContentRef = useRef<HTMLDivElement>(null);
  const blogContentRef = useRef<HTMLDivElement>(null);
  const awardsContentRef = useRef<HTMLDivElement>(null);

  return {
    heroRef,
    heroContentRef,
    aboutContentRef,
    projectsContentRef,
    experienceContentRef,
    skillsContentRef,
    testimonialsContentRef,
    blogContentRef,
    awardsContentRef
  };
}
