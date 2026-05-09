/**
 * Portfolio Data Types
 *
 * Centralized types for transformed CMS data used throughout the portfolio
 * These types represent the final shape of data after transformation from Strapi
 *
 * Note: We import existing component types to ensure compatibility
 */

// Import types from CMS transformers
import type { HeroData } from "@aazucena/types";
import type { AboutData } from "@aazucena/types";
import type { Project } from "@aazucena/types";
import type { Experience } from "@aazucena/types";
import type { BlogPost } from "@aazucena/types";
import type { Testimonial } from "~/components/ui/InfiniteMovingCards";
import type { Award } from "@aazucena/types";
import type { SkillCategory } from "@aazucena/types";
import type { ProjectShowcaseConfig } from "@aazucena/types";
import type { ExperienceShowcaseConfig } from "@aazucena/types";
import type { SkillShowcaseConfig } from "@aazucena/types";
import type { BlogConfigData } from "@aazucena/types";
import type { ServicesData } from "@aazucena/types";

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
  services: ServicesData;
}

/**
 * Optional partial type for cases where CMS data might be incomplete
 */
export type PartialPortfolioData = Partial<PortfolioData>;
