/**
 * SectionContent Component
 * Renders all 8 portfolio section contents with proper refs and pointer-events
 */

import type { JSX, RefObject } from "react";
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
import type { PortfolioData } from "~/types/portfolio";

interface SectionContentProps {
  refs: SectionRefs;
  currentSection: number;
  isSoundMuted: boolean;
  onOpenExperience: (index: number) => void;
  // Hero-specific props
  titleRef: RefObject<HTMLHeadingElement | null>;
  subtitleRef: RefObject<HTMLParagraphElement | null>;
  ctaRef: RefObject<HTMLDivElement | null>;
  flipTextRef: RefObject<HTMLElement | null>;
  currentFlipWord: string;
  onSectionClick: (index: number) => void;
  onViewResume: () => void;
  // Portfolio data from CMS
  portfolioData: PortfolioData;
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
  portfolioData,
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
          data={portfolioData.about}
          titleRef={titleRef}
          subtitleRef={subtitleRef}
          ctaRef={ctaRef}
          flipTextRef={flipTextRef}
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
        <AboutSection data={portfolioData.about} />
      </div>

      {/* Projects Content */}
      <div
        ref={refs.projectsContentRef}
        className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center"
        style={{ pointerEvents: currentSection === 2 ? "auto" : "none" }}
      >
        <ProjectsSection projects={portfolioData.projects} />
      </div>

      {/* Experience Content */}
      <div
        ref={refs.experienceContentRef}
        className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center"
        style={{ pointerEvents: currentSection === 3 ? "auto" : "none" }}
      >
        <ExperienceSection
          experiences={portfolioData.experiences}
          onOpenExperience={onOpenExperience}
        />
      </div>

      {/* Skills Content */}
      <div
        ref={refs.skillsContentRef}
        className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center"
        style={{ pointerEvents: currentSection === 4 ? "auto" : "none" }}
      >
        <SkillsSection
          skillCategories={portfolioData.skills}
          isSoundMuted={isSoundMuted}
        />
      </div>

      {/* Testimonials Content */}
      <div
        ref={refs.testimonialsContentRef}
        className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center pointer-events-none"
      >
        <TestimonialsSection testimonials={portfolioData.testimonials} />
      </div>

      {/* Blog Content */}
      <div
        ref={refs.blogContentRef}
        className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center"
        style={{ pointerEvents: currentSection === 6 ? "auto" : "none" }}
      >
        <BlogSection posts={portfolioData.posts} />
      </div>

      {/* Awards Content */}
      <div
        ref={refs.awardsContentRef}
        className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center"
        style={{ pointerEvents: currentSection === 7 ? "auto" : "none" }}
      >
        <AwardsSection awards={portfolioData.awards} />
      </div>
    </>
  );
}
