/**
 * Portfolio Data Types
 *
 * Centralized types for transformed CMS data used throughout the portfolio
 * These types represent the final shape of data after transformation from Strapi
 *
 * Note: We import existing component types to ensure compatibility
 */

// Import existing types from component data files
import type { ProfileData } from '~/components/animations/sections/data/about';
import type { SkillCategory } from '~/components/animations/sections/data/skills';
import type { Project as ProjectData } from '~/components/animations/sections/data/projects';
import type { Experience as ExperienceData } from '~/components/animations/sections/data/experiences';
import type { Testimonial as TestimonialData } from '~/components/animations/sections/data/testimonials';
import type { Award as AwardData } from '~/components/animations/sections/data/awards';
import type { BlogPost as PostData } from '~/components/animations/sections/data/blog';
import type { HeroData } from '~/lib/transformers/hero';
import type { AboutData } from '~/lib/transformers/about';
import type { BlogConfigData } from '~/lib/transformers/blog-config';
import type { ShowcaseConfig } from '~/lib/transformers/showcase';

// Re-export types for use in section components
export type { AboutData, SkillCategory, ProjectData, ExperienceData, TestimonialData, AwardData, PostData, BlogConfigData };

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
  skills: SkillCategory[];
  projects: ProjectData[];
  experiences: ExperienceData[];
  testimonials: TestimonialData[];
  awards: AwardData[];
  posts: PostData[];
  blog: BlogConfigData;
  showcase: ShowcaseConfig;
}

/**
 * Optional partial type for cases where CMS data might be incomplete
 */
export type PartialPortfolioData = Partial<PortfolioData>;
