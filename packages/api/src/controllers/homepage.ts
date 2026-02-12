import { getPortfolio } from '../modules/portfolio.js';
import { getAbout } from '../modules/about.js';
import { getHero } from '../modules/hero.js';
import { getProjects } from '../modules/projects.js';
import { getExperiences } from '../modules/experiences.js';
import { getPosts } from '../modules/posts.js';
import { getTestimonials } from '../modules/testimonials.js';
import { getAwards } from '../modules/awards.js';
import { getSkills } from '../modules/skills.js';
import { getHomepage } from '../modules/homepage.js';
import { getProjectShowcaseConfig } from '../modules/project-showcase.js';
import { getExperienceShowcase } from '../modules/experience-showcase.js';
import { getSkillShowcase } from '../modules/skill-showcase.js';
import { getWebsiteConfig } from '../modules/website-config.js';
import { getAnimationConfig } from '../modules/animation.js';
import { getBlogConfig } from '../modules/blog-config.js';
import type {
  HeroData,
  AboutData,
  Project,
  Experience,
  BlogPost,
  Testimonial,
  Award,
  SkillCategory,
  ProjectShowcaseConfig,
  ExperienceShowcaseConfig,
  SkillShowcaseConfig,
  BlogConfigData,
} from '@aazucena/types';

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
