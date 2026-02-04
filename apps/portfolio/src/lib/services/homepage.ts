import { getPortfolio } from '../api/portfolio';
import { getAbout } from '../api/about';
import { getHero } from '../api/hero';
import { getProjects } from '../api/projects';
import { getExperiences } from '../api/experiences';
import { getPosts } from '../api/posts';
import { getTestimonials } from '../api/testimonials';
import { getAwards } from '../api/awards';
import { getSkills } from '../api/skills';
import { getHomepage } from '../api/homepage';
import { getProjectShowcaseConfig } from '../api/project-showcase';
import { getExperienceShowcase } from '../api/experience-showcase';
import { getSkillShowcase } from '../api/skill-showcase';
import { getWebsiteConfig } from '../api/website-config';
import { getAnimationConfig } from '../api/animation';
import { getBlogConfig } from '../api/blog-config';
import type { HeroData } from '../transformers/hero';
import type { AboutData } from '../transformers/about';
import type { Project } from '../transformers/projects';
import type { Experience } from '../transformers/experiences';
import type { BlogPost } from '../transformers/posts';
import type { Testimonial } from '~/components/ui/infinite-moving-cards';
import type { Award } from '../transformers/awards';
import type { SkillCategory } from '../transformers/skills';
import type { ProjectShowcaseConfig } from '../transformers/project-showcase';
import type { ExperienceShowcaseConfig } from '../transformers/experience-showcase';
import type { SkillShowcaseConfig } from '../transformers/skill-showcase';
import type { BlogConfigData } from '../transformers/blog-config';

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
 * Orchestrates fetching of all data required for the homepage
 * Fetches everything in parallel for optimal performance
 */
export async function getHomepageData() {
  try {
    const [
      portfolio,
      about,
      hero,
      projects,
      experiences,
      blog,
      posts,
      testimonials,
      awards,
      skills,
      homepage,
      projectShowcase,
      experienceShowcase,
      skillShowcase,
      websiteConfig,
      animationConfig,
    ] = await Promise.all([
      getPortfolio(),
      getAbout(),
      getHero(),
      getProjects('home'),
      getExperiences(),
      getBlogConfig(),
      getPosts(true, 3), // Featured only, limit 3
      getTestimonials(),
      getAwards(),
      getSkills('featured'),
      getHomepage(),
      getProjectShowcaseConfig(),
      getExperienceShowcase(),
      getSkillShowcase(),
      getWebsiteConfig(),
      getAnimationConfig(),
    ]);

    const portfolioData: PortfolioData = {
      hero,
      about,
      projects,
      experiences,
      blog,
      posts,
      testimonials,
      awards,
      skills,
      projectShowcase,
      experienceShowcase,
      skillShowcase,
    };

    return {
      data: portfolioData,
      portfolio,
      homepage,
      websiteConfig,
      animationConfig,
    };
  } catch (error) {
    console.error('[HomepageData] Failed to fetch aggregate data:', error);
    throw error;
  }
}