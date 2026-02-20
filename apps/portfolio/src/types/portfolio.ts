/**
 * Portfolio Data Types
 *
 * Centralized types for transformed CMS data used throughout the portfolio
 * These types represent the final shape of data after transformation from Strapi
 *
 * Note: We import existing component types to ensure compatibility
 */

// Import types from CMS transformers
import type { HeroData } from "~/lib/transformers/hero";
import type { AboutData } from "~/lib/transformers/about";
import type { Project } from "~/lib/transformers/projects";
import type { Experience } from "~/lib/transformers/experiences";
import type { BlogPost } from "~/lib/transformers/posts";
import type { Testimonial } from "~/components/ui/infinite-moving-cards";
import type { Award } from "~/lib/transformers/awards";
import type { SkillCategory } from "~/lib/transformers/skills";
import type { ProjectShowcaseConfig } from "~/lib/transformers/project-showcase";
import type { ExperienceShowcaseConfig } from "~/lib/transformers/experience-showcase";
import type { SkillShowcaseConfig } from "~/lib/transformers/skill-showcase";
import type { BlogConfigData } from "~/lib/transformers/blog-config";

// ============================================================================
// Complete Portfolio Data
// ============================================================================

/**
 * Complete Portfolio Data
 *
 * This is the main interface that contains all section data
 * Passed from index.astro down through Section.tsx → SectionContent.tsx
 */
export interface PortfolioData {
  hero: HeroData;
  about: AboutData;
  projects: Project[];
  experiences: Experience[];
  blog: BlogConfigData;
  posts: BlogPost[];
  testimonials: Testimonial[];
  awards: Award[];
  skills: SkillCategory[];
  projectShowcase: ProjectShowcaseConfig;
  experienceShowcase: ExperienceShowcaseConfig;
  skillShowcase: SkillShowcaseConfig;
}

/**
 * Optional partial type for cases where CMS data might be incomplete
 */
export type PartialPortfolioData = Partial<PortfolioData>;
