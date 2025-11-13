/**
 * SectionContent Component
 * Renders all 8 portfolio section contents with proper refs and pointer-events
 */

import type { JSX, RefObject } from "react";
import { aboutData } from "./data/about";
import {
  HeroSection,
  AboutSection,
  ProjectsSection,
  ExperienceSection,
  SkillsSection,
  TestimonialsSection,
  BlogSection,
  AwardsSection,
} from "./index";
import type { SectionRefs } from "../hooks/useSectionRefs";

interface SectionContentProps {
  refs: SectionRefs;
  currentSection: number;
  isSoundMuted: boolean;
  onOpenExperience: (index: number) => void;
  // Hero-specific props
  titleRef: RefObject<HTMLHeadingElement>;
  subtitleRef: RefObject<HTMLParagraphElement>;
  ctaRef: RefObject<HTMLDivElement>;
  flipTextRef: RefObject<HTMLSpanElement>;
  currentFlipWord: string;
  onSectionClick: (index: number) => void;
  onViewResume: () => void;
}

export default function SectionContent({
  refs,
  currentSection,
  isSoundMuted,
  onOpenExperience,
  titleRef,
  subtitleRef,
  ctaRef,
  flipTextRef,
  currentFlipWord,
  onSectionClick,
  onViewResume,
}: SectionContentProps): JSX.Element {
  return (
    <>
      {/* Hero Content */}
      <div
        ref={refs.heroContentRef}
        className="relative z-30 w-full px-6 min-h-screen flex items-center"
        style={{ pointerEvents: currentSection === 0 ? "auto" : "none" }}
      >
        <HeroSection
          data={aboutData}
          titleRef={titleRef}
          subtitleRef={subtitleRef}
          ctaRef={ctaRef}
          flipTextRef={flipTextRef as any}
          currentFlipWord={currentFlipWord}
          onSectionClick={onSectionClick}
          onViewResume={onViewResume}
        />
      </div>

      {/* About Content */}
      <div
        ref={refs.aboutContentRef}
        className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center pointer-events-none"
      >
        <AboutSection data={aboutData} />
      </div>

      {/* Projects Content */}
      <div
        ref={refs.projectsContentRef}
        className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center"
        style={{ pointerEvents: currentSection === 2 ? "auto" : "none" }}
      >
        <ProjectsSection />
      </div>

      {/* Experience Content */}
      <div
        ref={refs.experienceContentRef}
        className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center"
        style={{ pointerEvents: currentSection === 3 ? "auto" : "none" }}
      >
        <ExperienceSection onOpenExperience={onOpenExperience} />
      </div>

      {/* Skills Content */}
      <div
        ref={refs.skillsContentRef}
        className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center"
        style={{ pointerEvents: currentSection === 4 ? "auto" : "none" }}
      >
        <SkillsSection isSoundMuted={isSoundMuted} />
      </div>

      {/* Testimonials Content */}
      <div
        ref={refs.testimonialsContentRef}
        className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center pointer-events-none"
      >
        <TestimonialsSection />
      </div>

      {/* Blog Content */}
      <div
        ref={refs.blogContentRef}
        className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center"
        style={{ pointerEvents: currentSection === 6 ? "auto" : "none" }}
      >
        <BlogSection />
      </div>

      {/* Awards Content */}
      <div
        ref={refs.awardsContentRef}
        className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center"
        style={{ pointerEvents: currentSection === 7 ? "auto" : "none" }}
      >
        <AwardsSection />
      </div>
    </>
  );
}
